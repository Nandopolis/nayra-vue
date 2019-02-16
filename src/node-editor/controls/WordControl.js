import Rete from "rete";
import VueWordControl from "./WordControl.vue";

export class WordControl extends Rete.Control {
  constructor(emitter, key, readonly) {
    super(key);
    this.data.render = "vue";
    this.component = VueWordControl;
    this.props = { emitter, ikey: key, readonly };
  }

  setValue(val) {
    this.vueContext.value = val;
  }
}
