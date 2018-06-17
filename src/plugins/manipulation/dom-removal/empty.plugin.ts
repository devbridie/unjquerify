import {assignmentExpression, identifier, memberExpression, stringLiteral} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";
import {isCallOnjQuery, pullOutNativeElement} from "../../../util/jquery-heuristics";

export const EmptyPlugin: Plugin = {
    name: "EmptyPlugin",
    path: ["manipulation", "dom-removal", "empty"],
    references: [
        jqueryApiReference("empty"),
        mdnReference("Element/innerHTML"),
        youDontNeedJquery("3.10"),
    ],
    fromExample: `$el.empty()`,
    toExample: `el.innerHTML = ''`,
    description: `Converts $el.empty() calls.`,

    babel: () => ({
        visitor: {
            CallExpression: (path) => {
                const node = path.node;
                if (!isCallOnjQuery(node, "empty")) return;
                if (node.arguments.length !== 0) return;

                const el = pullOutNativeElement(node.callee.object);
                const innerHTML = memberExpression(el, identifier("innerHTML"));
                const assignment = assignmentExpression("=", innerHTML, stringLiteral(""));
                path.replaceWith(assignment);
            },
        },
    }),
};
