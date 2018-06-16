import {callExpression, identifier, memberExpression} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";
import {isCallOnjQuery, pullOutNativeElement} from "../../../util/jquery-heuristics";

export const RemovePlugin: Plugin = {
    name: "RemovePlugin",
    path: ["manipulation", "dom-removal", "remove"],
    references: [
        jqueryApiReference("remove"),
        mdnReference("Node/removeChild"),
        youDontNeedJquery("3.1"),
    ],
    fromExample: `$el.remove()`,
    toExample: `el.parentNode.removeChild(el)`,
    description: `Converts $el.remove() calls.`,

    babel: () => ({
        visitor: {
            CallExpression: (path) => {
                const node = path.node;
                if (!isCallOnjQuery(node, "remove")) return;

                if (node.arguments.length !== 0) return; // TODO write args == 1 case

                const el = pullOutNativeElement(node.callee.object);
                const parentNode = memberExpression(el, identifier("parentNode"));
                const removeChild = memberExpression(parentNode, identifier("removeChild"));
                const call = callExpression(removeChild, [el]);
                path.replaceWith(call);
            },
        },
    }),
};
