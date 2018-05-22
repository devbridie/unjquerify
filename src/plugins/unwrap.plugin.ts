import * as babel from "babel-core";
import {
    arrowFunctionExpression,
    callExpression,
    ExpressionStatement,
    identifier,
    isCallExpression,
    isIdentifier,
    isMemberExpression,
    memberExpression,
    MemberExpression,
    Node,
} from "babel-types";
import {isJQueryWrappedElement, unWrapjQueryElement} from "../util/jquery-heuristics";
import {NodePath} from "babel-traverse";

function innerIsArray(node: Node) {
    if (isCallExpression(node)) {
        const arrayReturnCalls = ["querySelectorAll", "getElementsByClassName"];
        if (isMemberExpression(node.callee)) {
            const callee = node.callee;
            if (!isIdentifier(callee.property)) return false;
            const id = callee.property.name;
            if (arrayReturnCalls.some(call => call === id)) return true;
        }
    }
    return false;
}

export const UnwrapPlugin = () => ({
    visitor: {
        /*
            $(htmlElement)[0] => htmlElement
         */
        MemberExpression: {
            exit: (path: NodePath<MemberExpression>) => {
                const node = path.node;
                if (!isIdentifier(node.property)) return;
                if (node.property.name !== "0") return;
                if (!isJQueryWrappedElement(node.object)) return;
                const arg = unWrapjQueryElement(node.object);
                if (innerIsArray(arg)) {
                    const map = memberExpression(arg, identifier("map"));
                    const elementId = path.scope.generateUidIdentifier("element");

                    path.replaceWith(elementId);
                    const parentStatement = path.getStatementParent() as NodePath<ExpressionStatement>;
                    const parentExpr = parentStatement.node.expression;

                    const lambda = arrowFunctionExpression([elementId], parentExpr);
                    const mapCall = callExpression(map, [lambda]);

                    parentStatement.replaceWith(mapCall);

                } else {
                    path.replaceWith(arg);
                }
            },
        },
    } as babel.Visitor<{}>,
});