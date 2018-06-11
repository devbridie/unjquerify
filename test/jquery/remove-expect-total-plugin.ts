import {
    isCallExpression,
    isFunctionExpression,
    isIdentifier,
    isMemberExpression,
    isStringLiteral,
    numericLiteral
} from "babel-types";
import {Visitor} from "babel-traverse";

export function removeExpectTotalPlugin(testName: string, newTotal: number) {
    return {
        visitor: {
            ExpressionStatement: (nodePath) => {
                const expression = nodePath.node.expression;
                if (!isCallExpression(expression)) return;
                const callee = expression.callee;
                if (!isMemberExpression(callee)) return;
                if (!(isIdentifier(callee.object) && callee.object.name === "QUnit")) return;
                if (!(isIdentifier(callee.property) && callee.property.name === "test")) return;

                const foundTestName = expression.arguments[0];
                if (!isStringLiteral(foundTestName)) return;
                if (foundTestName.value !== testName) return;

                const testFunction = expression.arguments[1];
                if (!(isFunctionExpression(testFunction))) return;
                const path = nodePath.get("expression.arguments.1.body.body.0.expression.arguments.0");

                path.replaceWith(numericLiteral(newTotal));
            },
        } as Visitor<any>,
    };
}
