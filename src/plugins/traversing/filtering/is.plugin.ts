import {callExpression, identifier, memberExpression} from "babel-types";

import {isCallOnjQuery, pullOutNativeElement} from "../../../util/jquery-heuristics";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";
import {Plugin} from "../../../model/plugin";

export const IsPlugin: Plugin = {
    name: "IsPlugin",
    path: ["traversing", "filtering"],
    references: [
        jqueryApiReference("is"),
        mdnReference("Element/matches"),
        youDontNeedJquery("3.8"),
    ],
    fromExample: `$el.is(selectorString)")`,
    toExample: `el.matches(selectorString)`,
    description: `Converts $el.is(string) calls.`,
    babel: () => ({
        visitor: {
            CallExpression: (path) => {
                const node = path.node;
                if (!isCallOnjQuery(node, "is")) return;

                if (node.arguments.length !== 1) return;
                const el = pullOutNativeElement(node.callee.object);

                const matches = memberExpression(el, identifier("matches"));
                const call = callExpression(matches, [node.arguments[0]]);
                path.replaceWith(call);
            },
        },
    }),
};
