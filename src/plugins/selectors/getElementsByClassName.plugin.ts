import {isStringLiteral, stringLiteral} from "babel-types";

import {unWrapjQueryElement} from "../../util/jquery-heuristics";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../util/references";
import {Plugin} from "../../model/plugin";
import {CallExpressionOfjQueryGlobal} from "../../model/call-expression-of-jquery-global";

const template = require("@babel/template");

const replaceAstTemplate = template.expression(`$(document.getElementsByClassName(CLASSNAME))`,
    {placeholderPattern: /^[_A-Z0-9]+$/},
);

export const GetElementsByClassNamePlugin: Plugin = {
    name: "GetElementsByClassNamePlugin",
    path: ["selectors", "getElementsByClassName"],
    causesChainMutation: false,
    matchesExpressionType: new CallExpressionOfjQueryGlobal(),
    references: [
        jqueryApiReference("jQuery"),
        mdnReference("Document/getElementsByClassName"),
        youDontNeedJquery("1.1"),
    ],
    fromExample: `$(".<class>")`,
    toExample: `$(document.getElementsByClassName("<class>"))`,
    description: `Converts $(".<class>") calls.`,
    babel: () => ({
        visitor: {
            CallExpression: (path) => {
                const unwrapped = unWrapjQueryElement(path.node);
                if (!unwrapped) return;
                if (!isStringLiteral(unwrapped)) return;

                const literal = unwrapped.value;
                if (!/^\.[a-zA-Z0-9]+$/.test(literal)) return;
                const cssClass = literal.slice(1);
                const newLiteral = stringLiteral(cssClass);
                path.replaceWith(replaceAstTemplate({CLASSNAME: newLiteral}));
            },
        },
    }),
};
