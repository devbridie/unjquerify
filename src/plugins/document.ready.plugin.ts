import * as babel from "babel-core";

import * as types from "babel-types";
import {
    binaryExpression,
    CallExpression,
    callExpression,
    expressionStatement,
    identifier,
    Identifier,
    ifStatement, memberExpression,
    MemberExpression,
    stringLiteral,
    variableDeclaration,
    variableDeclarator,
} from "babel-types";

import * as util from "../util/jquery-heuristics";

export default () => ({
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
        ExpressionStatement: (path) => {
            const callee = (path.node.expression as CallExpression).callee; // in this case, probably $(document).ready
            if (!types.isMemberExpression(callee)) {
                return;
            }
            const member = callee as MemberExpression;
            if (!util.isJQueryWrappedElement(member.object)) {
                return;
            }
            const unwrapped = util.unWrapjQueryElement(member.object);
            if (!types.isIdentifier(unwrapped) || (unwrapped as Identifier).name !== "document") {
                return;
            }
            if (!types.isIdentifier(member.property) || (member.property as Identifier).name !== "ready") {
                return;
            }
            console.log("Found replacement candidate $(document.ready)");

            // pull out ready argument
            const argument = ((path.node.expression as CallExpression).arguments[0]) as types.FunctionExpression;
            const readyFunction = path.scope.generateUidIdentifier("onLoadListener");
            path.insertBefore(
                variableDeclaration("const", [variableDeclarator(readyFunction, argument)]),
            );

            const document = identifier("document");
            const documentReadyState = memberExpression(document, identifier("readyState"));
            const replacement = ifStatement(
                binaryExpression("!==", documentReadyState, stringLiteral("loading")),
                expressionStatement(callExpression(readyFunction, [])),
                expressionStatement(callExpression(
                    memberExpression(document, identifier("addEventListener")), [
                        stringLiteral("DOMContentLoaded"),
                        readyFunction,
                    ]),
                ),
            );

            path.replaceWith(replacement);
        },
    } as babel.Visitor<{}>,
});
