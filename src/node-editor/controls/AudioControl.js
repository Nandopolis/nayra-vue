import Rete from "rete";
import VueAudioControl from "./AudioControl.vue";

export class AudioControl extends Rete.Control {
  constructor(emitter, key, readonly) {
    super(key);
    this.data.render = "vue";
    this.component = VueAudioControl;
    this.props = { emitter, ikey: key, readonly };
  }

  setValue(val) {
    this.vueContext.value = val;
  }
}
