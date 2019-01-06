import Rete from "rete";
import * as Socket from "../sockets";
import { AudioControl } from "../controls/AudioControl";

export class AudioComponent extends Rete.Component {
  constructor() {
    super("Audio");
  }

  builder(node) {
    var inp1 = new Rete.Input("start", "start", Socket.numSocket, true);
    var out1 = new Rete.Output("end", "end", Socket.numSocket);

    return node
      .addControl(new AudioControl(this.editor, "audio"))
      .addInput(inp1)
      .addOutput(out1);
  }
}
