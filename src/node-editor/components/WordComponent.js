import Rete from "rete";
import * as Socket from "../sockets";
import { WordControl } from "../controls/WordControl";

export class WordComponent extends Rete.Component {
  constructor(name, outputs) {
    let label = "Recognition: " + name;
    super(label);
    this.na = name;
    this.outputs = outputs;
  }

  builder(node) {
    var out = [];
    this.outputs.forEach((output, index) => {
      out[index] = new Rete.Output(output, output, Socket.numSocket);
      node.addControl(new WordControl(this.editor, output, true));
      node.addOutput(out[index]);
    });
    var inp1 = new Rete.Input("start", "start", Socket.numSocket, true);

    return node
      .addInput(inp1);
  }
}
