import Rete from "rete";
import * as Socket from "../sockets";
import { AudioControl } from "../controls/AudioControl";

export class PresenComponent extends Rete.Component {
  constructor() {
    super("Presentation");
  }

  builder(node) {
    var out1 = new Rete.Output("end", "end", Socket.numSocket);

    return node
      .addControl(new AudioControl(this.editor, "audio"))
      .addOutput(out1);
  }
}
