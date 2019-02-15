import Rete from "rete";
import * as Socket from "../sockets";
import { TextControl } from "../controls/TextControl";

export class TTSComponent extends Rete.Component {
  constructor() {
    super("Text to Speech");
  }

  builder(node) {
    var inp1 = new Rete.Input("start", "start", Socket.numSocket, true);
    var out1 = new Rete.Output("end", "end", Socket.numSocket);

    return node
      .addControl(new TextControl(this.editor, "text", false))
      .addInput(inp1)
      .addOutput(out1);
  }
}
