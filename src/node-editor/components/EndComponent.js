import Rete from "rete";
import * as Socket from "../sockets";
import { AudioControl } from "../controls/AudioControl";

export class EndComponent extends Rete.Component {
  constructor() {
    super("Terminate");
  }

  builder(node) {
    var inp1 = new Rete.Input("start", "start", Socket.numSocket, true);

    return node
      .addControl(new AudioControl(this.editor, "audio"))
      .addInput(inp1);
  }
}
