import {callExpression, identifier, memberExpression} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";
import {isCallOnjQuery, pullOutNativeElement} from "../../../util/jquery-heuristics";

export const AttrSetPlugin: Plugin = {
    name: "AttrSetPlugin",
    path: ["manipulation", "general-attributes", "attr.set"],
    references: [
        jqueryApiReference("attr"),
        mdnReference("Element/setAttribute"),
        youDontNeedJquery("1.11"),
    ],
    fromExample: `$el.attr("foo", "bar")`,
    toExample: `el.setAttribute("foo", "bar")`,
    description: `Converts calls for attribute set.`,
    babel: () => ({
        visitor: {
            CallExpression: (path) => {
                const node = path.node;
                if (!isCallOnjQuery(node, "attr")) return;
                if (node.arguments.length !== 2) return;
                const property = node.arguments[0];
                const value = node.arguments[1];
                const el = pullOutNativeElement(node.callee.object);
                const getAttribute = memberExpression(el, identifier("setAttribute"));
                const callWithArg = callExpression(getAttribute, [property, value]);
                path.replaceWith(callWithArg);
            },
        },
    }),
};
