import * as babel from "babel-core";

import {isCallExpression, isFunctionExpression, isIdentifier, isMemberExpression, Node} from "babel-types";
import {isJQueryWrappedElement, unWrapjQueryElement} from "../../../util/jquery-heuristics";

const template = require("@babel/template");

const replaceAstTemplate = template.statements(`
    const LISTENER_ID = LISTENER_FUNCTION;
    if (document.readyState !== 'loading') {
        LISTENER_ID();
    } else {
        document.addEventListener('DOMContentLoaded', LISTENER_ID);
    }
`);

export const DocumentReadyPlugin = () => ({
    visitor: {
        /**
         * Transforms <code>$(document).ready(e)</code> to
         * <code><pre>
         * if (document.readyState !== 'loading') {
         *   e();
         * } else {
         *   document.addEventListener('DOMContentLoaded', e);
         * }
         * </code></pre>
         */
        ExpressionStatement: path => {
            if (!isCallExpression(path.node.expression)) return;
            const callExpression = path.node.expression;
            if (!isMemberExpression(callExpression.callee)) return;
            const member = callExpression.callee;
            if (!(isIdentifier(member.property) && member.property.name === "ready")) return;
            const object = callExpression.callee.object;
            if (!isJQueryWrappedElement(object)) return;
            const unwrapped = unWrapjQueryElement(object);
            if (!(isIdentifier(unwrapped) && unwrapped.name === "document")) return;

            const argument = callExpression.arguments[0];
            if (!isFunctionExpression(argument)) return;

            console.log("Found replacement candidate $(document.ready)");
            path.replaceWithMultiple(replaceAstTemplate({
                LISTENER_FUNCTION: argument,
                LISTENER_ID: path.scope.generateUidIdentifier("onLoadListener"),
            }) as Node[]);
        },
    } as babel.Visitor<{}>,
});
