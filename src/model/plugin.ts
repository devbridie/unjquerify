import {Node, PluginObj} from "babel-core";
import {Reference} from "./reference";

export interface Plugin {
    name: string;
    path: string[];
    babel: () => PluginObj<Node>;
    references: Reference[];
    fromExample: string;
    toExample: string;
    description: string;
}
