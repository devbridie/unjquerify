import {callExpression, identifier, memberExpression} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";
import {isCallOnjQuery, pullOutNativeElement} from "../../../util/jquery-heuristics";

export const AttrGetPlugin: Plugin = {
    name: "AttrGetPlugin",
    path: ["manipulation", "general-attributes", "attr.get"],
    references: [
        jqueryApiReference("attr"),
        mdnReference("Element/getAttribute"),
        youDontNeedJquery("1.11"),
    ],
    fromExample: `$el.attr("foo")`,
    toExample: `el.getAttribute("foo")`,
    description: `Converts calls for attribute get.`,
    babel: () => ({
        visitor: {
            CallExpression: (path) => {
                const node = path.node;
                if (!isCallOnjQuery(node, "attr")) return;
                if (node.arguments.length !== 1) return;
                const property = node.arguments[0];
                const el = pullOutNativeElement(node.callee.object);
                const getAttribute = memberExpression(el, identifier("getAttribute"));
                const callWithArg = callExpression(getAttribute, [property]);
                path.replaceWith(callWithArg);
            },
        },
    }),
};
