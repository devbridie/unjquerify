import * as babel from "babel-core";

import * as types from "babel-types";
import {CallExpression, Identifier, MemberExpression, Node} from "babel-types";

const template = require("@babel/template");
import * as util from "../util/jquery-heuristics";

const replaceAstTemplate = template.statements(`
    const LISTENER_ID = LISTENER_FUNCTION;
    if (document.readyState !== 'loading') {
        LISTENER_ID();
    } else {
        document.addEventListener('DOMContentLoaded', LISTENER_ID);
    }
`);

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
            const replacement = replaceAstTemplate({
                LISTENER_FUNCTION: argument,
                LISTENER_ID: path.scope.generateUidIdentifier("onLoadListener"),
            }) as any as Node[];

            path.replaceWithMultiple(replacement);
        },
    } as babel.Visitor<{}>,
});
