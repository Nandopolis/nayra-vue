import Rete from "rete";
import * as Socket from "../sockets";
import { RecogControl } from "../controls/RecogControl";

export class RecogComponent extends Rete.Component {
  constructor(name, outputs) {
    let label = "Recognition: " + name;
    super(label);
    this.na = name;
    this.outputs = outputs;
  }

  builder(node) {
    this.outputs.forEach(output => {
      node.addOutput(new Rete.Output(output, output, Socket.numSocket));
    });
    var inp1 = new Rete.Input("start", "start", Socket.numSocket, true);

    return node
      .addControl(new RecogControl(this.editor, "recog", true))
      .addInput(inp1);
  }
}
