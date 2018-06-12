import {isFunctionExpression, isIdentifier, Node} from "babel-types";
import {isCallOnjQuery, unWrapjQueryElement} from "../../../util/jquery-heuristics";
import {Plugin} from "../../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";

const template = require("@babel/template");

const replaceAstTemplate = template.statements(`
    const LISTENER_ID = LISTENER_FUNCTION;
    if (document.readyState !== 'loading') {
        LISTENER_ID();
    } else {
        document.addEventListener('DOMContentLoaded', LISTENER_ID);
    }
`);

export const DocumentReadyPlugin: Plugin = {
    name: "DocumentReadyPlugin",
    path: ["events", "document-loading", "document.ready"],
    references: [
        jqueryApiReference("ready"),
        mdnReference("Events/DOMContentLoaded"),
        youDontNeedJquery("5.0"),
    ],
    fromExample: `$(document).ready(e)`,
    toExample: `if (document.readyState !== 'loading') {
    e();
} else {
    document.addEventListener('DOMContentLoaded', e);
}`,
    description: "Converts $(document).ready calls.",

    babel: () => ({
        visitor: {
            ExpressionStatement: path => {
                const node = path.node.expression;
                if (!isCallOnjQuery(node, "ready")) return;

                const unwrapped = unWrapjQueryElement(node.callee.object);
                if (!unwrapped) return;
                if (!(isIdentifier(unwrapped) && unwrapped.name === "document")) return;

                const argument = node.arguments[0];
                if (!isFunctionExpression(argument)) return;

                path.replaceWithMultiple(replaceAstTemplate({
                    LISTENER_FUNCTION: argument,
                    LISTENER_ID: path.scope.generateUidIdentifier("onLoadListener"),
                }) as Node[]);
            },
        },
    }),
};
