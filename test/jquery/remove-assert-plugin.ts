import {isIdentifier, isMemberExpression, isStringLiteral} from "babel-types";
import {Visitor} from "babel-traverse";

export function removeAssertPlugin(assertRegexes: RegExp[]) {
    return ({
        visitor: {
            CallExpression: (nodePath) => {
                const node = nodePath.node;
                const callee = node.callee;
                if (!isMemberExpression(callee)) return;
                if (!(isIdentifier(callee.object) && callee.object.name === "assert")) return;
                const assertDescriptionNode = node.arguments[node.arguments.length - 1];
                if (!isStringLiteral(assertDescriptionNode)) return;
                const assertDescription = assertDescriptionNode.value;

                if (!assertRegexes.some(regex => regex.test(assertDescription))) return;
                nodePath.remove();
            },
        } as Visitor<any>,
    });
}
