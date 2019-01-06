import Rete from "rete";
import VueRecogControl from "./RecogControl.vue";

export class RecogControl extends Rete.Control {
  constructor(emitter, key, readonly) {
    super(key);
    this.component = VueRecogControl;
    this.props = { emitter, ikey: key, readonly };
  }

  setValue(val) {
    this.vueContext.value = val;
  }
}
