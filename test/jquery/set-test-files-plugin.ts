import {arrayExpression, isIdentifier, stringLiteral} from "babel-types";
import {Visitor} from "babel-traverse";

export function setTestFilesPlugin(files: string[]) {
    return ({
        visitor: {
            VariableDeclarator: (nodePath) => {
                if (isIdentifier(nodePath.node.id) && nodePath.node.id.name === "tests") {
                    nodePath.get("init").replaceWith(arrayExpression(files.map(file => stringLiteral(file))));
                }
            },
        } as Visitor<any>,
    });
}
