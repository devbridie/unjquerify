import {Node, PluginObj} from "babel-core";
import {Reference} from "./reference";
import {JQueryExpressionType} from "./jquery-expression-type";

export interface Plugin {
    name: string;
    path: string[];
    babel: () => PluginObj<Node>;
    causesChainMutation: boolean;
    matchesExpressionType: JQueryExpressionType;
    references: Reference[];
    fromExample: string;
    toExample: string;
    description: string;
}
