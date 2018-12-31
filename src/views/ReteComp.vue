<template>
  <div id="rete" class="node-editor"></div>
</template>

<script>
import Rete from "rete";
import ConnectionPlugin from "rete-connection-plugin";
import VueRenderPlugin from "rete-vue-render-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import AreaPlugin from "rete-area-plugin";
import CommentPlugin from "rete-comment-plugin";
import MinimapPlugin from "rete-minimap-plugin";
import ConnectionReroutePlugin from "rete-connection-reroute-plugin";

var numSocket = new Rete.Socket("Number value");

var VueNumControl = {
  props: ["readonly", "emitter", "ikey", "getData", "putData"],
  template:
    '<input type="number" :readonly="readonly" :value="value" @input="change($event)" @dblclick.stop=""/>',
  data() {
    return {
      value: 0
    };
  },
  methods: {
    change(e) {
      this.value = +e.target.value;
      this.update();
    },
    update() {
      if (this.ikey) this.putData(this.ikey, this.value);
      this.emitter.trigger("process");
    }
  },
  mounted() {
    this.value = this.getData(this.ikey);
  }
};

class NumControl extends Rete.Control {
  constructor(emitter, key, readonly) {
    super(key);
    this.component = VueNumControl;
    this.props = { emitter, ikey: key, readonly };
  }

  setValue(val) {
    this.vueContext.value = val;
  }
}

class NumComponent extends Rete.Component {
  constructor() {
    super("Number");
  }

  builder(node) {
    var out1 = new Rete.Output("num", "Number", numSocket);

    return node.addControl(new NumControl(this.editor, "num")).addOutput(out1);
  }

  worker(node, inputs, outputs) {
    outputs["num"] = node.data.num;
  }
}

class AddComponent extends Rete.Component {
  constructor() {
    super("Add");
  }

  builder(node) {
    var inp1 = new Rete.Input("num1", "Number", numSocket);
    var inp2 = new Rete.Input("num2", "Number2", numSocket);
    var out = new Rete.Output("num", "Number", numSocket);

    inp1.addControl(new NumControl(this.editor, "num1"));
    inp2.addControl(new NumControl(this.editor, "num2"));

    return node
      .addInput(inp1)
      .addInput(inp2)
      .addControl(new NumControl(this.editor, "preview", true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    var n1 = inputs["num1"].length ? inputs["num1"][0] : node.data.num1;
    var n2 = inputs["num2"].length ? inputs["num2"][0] : node.data.num2;
    var sum = n1 + n2;

    this.editor.nodes
      .find(n => n.id == node.id)
      .controls.get("preview")
      .setValue(sum);
    outputs["num"] = sum;
  }
}

export default {
  name: "ReteComp",
  props: ["editor-json"],
  computed: {
    localEditorJson: {
      get() {
        return this.editorJson;
      },
      set(value) {
        if (JSON.stringify(this.localEditorJson) != JSON.stringify(value)) {
          console.log("emitting editor-json");
          this.$emit("update:editor-json", value);
        }
      }
    }
  },
  data: () => ({
    editor: null,
    editingFromJson: false,
    editingFromGui: false
  }),
  watch: {
    async editorJson(val, oldVal) {
      if (
        !this.editingFromGui &&
        JSON.stringify(val) != JSON.stringify(oldVal)
      ) {
        console.log("editor-json changed");
        this.editingFromJson = true;
        await this.editor.fromJSON(this.localEditorJson);
        this.editingFromJson = false;
      } else {
        this.editingFromGui = false;
      }
    }
  },
  mounted() {
    (async () => {
      var container = document.querySelector("#rete");
      console.log(container);
      var components = [new NumComponent(), new AddComponent()];
      console.log(components);

      this.editor = new Rete.NodeEditor("demo@0.1.0", container);
      this.editor.use(ConnectionPlugin);
      this.editor.use(VueRenderPlugin);
      this.editor.use(ContextMenuPlugin);
      this.editor.use(AreaPlugin);
      this.editor.use(CommentPlugin);
      this.editor.use(MinimapPlugin, { size: "small" });
      this.editor.use(ConnectionReroutePlugin);
      console.log(this.editor);

      components.map(c => {
        this.editor.register(c);
      });

      this.editingFromJson = true;
      await this.editor.fromJSON(this.localEditorJson);
      this.editingFromJson = false;

      this.editor.on(
        "nodecreated noderemoved connectioncreated connectionremoved",
        async () => {
          if (!this.editingFromJson) {
            console.log("editor modified");
            this.editingFromGui = true;
            this.localEditorJson = this.editor.toJSON();
            console.log(this.localEditorJson);
          }
        }
      );

      this.editor.view.resize();
      AreaPlugin.zoomAt(this.editor);
      this.editor.trigger("process");
    })();
  }
};
</script>

<style>
.node-editor .minimap.small {
  width: 150px;
  height: 100px !important;
}

.node-editor .minimap {
  position: absolute;
  right: 0px !important;
  top: 0px !important;
  bottom: auto !important;
  background: rgba(89, 132, 152, 0.1);
  padding: 20px;
  overflow: hidden;
  border: 1px solid #b1b7ff;
  border-radius: 8px;
}
</style>
