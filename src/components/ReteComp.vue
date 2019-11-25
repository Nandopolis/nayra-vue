<template>
  <div id="rete" class="node-editor" ref="rete"></div>
</template>

<script>
import Rete from "rete";
import ConnectionPlugin from "rete-connection-plugin";
import VueRenderPlugin from "rete-vue-render-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import AreaPlugin from "rete-area-plugin";
// import CommentPlugin from "rete-comment-plugin";
import MinimapPlugin from "rete-minimap-plugin";
import ConnectionReroutePlugin from "rete-connection-reroute-plugin";
import { NumComponent } from "../node-editor/components/NumComponent.js";
import { AddComponent } from "../node-editor/components/AddComponent.js";
import { AudioComponent } from "../node-editor/components/AudioComponent.js";
import { PresenComponent } from "../node-editor/components/PresenComponent.js";
import { RecogComponent } from "../node-editor/components/RecogComponent.js";
import { EndComponent } from "../node-editor/components/EndComponent.js";
import { TTSComponent } from "../node-editor/components/TTSComponent.js";
import { WordComponent } from "../node-editor/components/WordComponent.js";

export default {
  name: "ReteComp",
  props: ["editor-json"],
  data: () => ({
    editor: null,
    recogs: [
      { name: "1", outputs: ["opt1"] },
      { name: "2", outputs: ["opt1", "opt2"] },
      { name: "3", outputs: ["opt1", "opt2", "opt3"] }
    ]
  }),
  watch: {
    async editorJson(val, oldVal) {
      await this.editor.fromJSON(JSON.parse(this.editorJson));
      this.setDiagram(this.editorJson);
      this.resize();
    }
  },
  methods: {
    setDiagram(diagram) {
      this.$store.commit("setDiagram", diagram);
    },
    resize() {
      this.editor.view.resize();
      AreaPlugin.zoomAt(this.editor);
    }
  },
  mounted() {
    var components = [
      // new NumComponent(),
      // new AddComponent(),
      new PresenComponent(),
      new AudioComponent(),
      new TTSComponent(),
      // new RecogComponent("Generos", ["hombre", "mujer"])
    ];
    this.recogs.forEach(recog => {
      components.push(new WordComponent(recog.name, recog.outputs));
    });
    components.push(new EndComponent());

    this.editor = new Rete.NodeEditor("demo@0.1.0", this.$refs.rete);
    this.editor.use(ConnectionPlugin);
    this.editor.use(VueRenderPlugin);
    this.editor.use(ContextMenuPlugin);
    this.editor.use(AreaPlugin);
    // this.editor.use(CommentPlugin);
    this.editor.use(MinimapPlugin, { size: "small" });
    this.editor.use(ConnectionReroutePlugin);

    components.map(c => {
      this.editor.register(c);
    });

    this.editor.fromJSON(JSON.parse(this.editorJson));
    this.setDiagram(JSON.stringify(this.editor.toJSON()));

    this.editor.on(
      "process nodecreated noderemoved connectioncreated connectionremoved updateconnection",
      () => {
        if (!this.editor.silent) {
          this.setDiagram(JSON.stringify(this.editor.toJSON()));
        }
      }
    );

    this.resize();
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
