import * as babel from "babel-core";

import {isCallExpression, isFunctionExpression, isIdentifier, isMemberExpression, Node} from "babel-types";
import {some} from "fp-ts/lib/Option";
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
            some(path.node.expression)
                .mapNullable(e => isCallExpression(e) ? e : null)
                .filter(callExpression => some(callExpression)
                    .mapNullable(e => isMemberExpression(e.callee) ? e.callee : null)
                    .filter(member => isIdentifier(member.property) && member.property.name === "ready")
                    .map(member => member.object)
                    .mapNullable(object => isJQueryWrappedElement(object) ? unWrapjQueryElement(object) : null)
                    .filter(unwrapped => isIdentifier(unwrapped) && unwrapped.name === "document")
                    .isSome())
                .map(callExpression => callExpression.arguments[0])
                .mapNullable(argument => isFunctionExpression(argument) ? argument : null)
                .mapNullable(argument => {
                    console.log("Found replacement candidate $(document.ready)");
                    path.replaceWithMultiple(replaceAstTemplate({
                        LISTENER_FUNCTION: argument,
                        LISTENER_ID: path.scope.generateUidIdentifier("onLoadListener"),
                    }) as Node[]);
                });
        },
    } as babel.Visitor<{}>,
});
