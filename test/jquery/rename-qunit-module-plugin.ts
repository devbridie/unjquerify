import {isCallExpression, isIdentifier, isMemberExpression, isStringLiteral} from "babel-types";
import {Visitor} from "babel-traverse";

const template = require("@babel/template");

export function renameQunitModulePlugin(newName: string) {
    const renameQunitModuleTemplate = template.expression(`QUnit.module("${newName}", ARG2)`);
    return ({
        visitor: {
            ExpressionStatement: (nodePath) => {
                const expression = nodePath.node.expression;
                if (!isCallExpression(expression)) return;
                const callee = expression.callee;
                if (!isMemberExpression(callee)) return;
                if (!(isIdentifier(callee.object) && callee.object.name === "QUnit")) return;
                if (!(isIdentifier(callee.property) && callee.property.name === "module")) return;
                const moduleName = expression.arguments[0];
                if (!isStringLiteral(moduleName)) return;

                if (moduleName.value !== newName) {
                    nodePath.replaceWith(renameQunitModuleTemplate({ARG2: expression.arguments[1]}));
                }
            },
        } as Visitor<any>,
    });
}
