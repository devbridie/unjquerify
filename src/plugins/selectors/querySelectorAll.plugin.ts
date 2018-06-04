import {isStringLiteral} from "babel-types";

import {isJQueryWrappedElement, unWrapjQueryElement} from "../../util/jquery-heuristics";
import {Plugin} from "../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../util/references";

const template = require("@babel/template");

const replaceAstTemplate = template.expression(`$(document.querySelectorAll(SELECTOR))`,
    {placeholderPattern: /^[_A-Z0-9]+$/},
);

export const QuerySelectorAllPlugin: Plugin = {
    name: "QuerySelectorAllPlugin",
    path: ["selectors", "querySelectorAll"],
    references: [
        jqueryApiReference("jQuery"),
        mdnReference("Document/querySelectorAll"),
        youDontNeedJquery("1.0"),
    ],
    fromExample: `$("<selector>")`,
    toExample: `$(document.querySelectorAll("<selector>"))`,
    description: `Converts $("<selector>") calls.`,

    babel: () => ({
        visitor: {
            CallExpression: (path) => {
                if (!isJQueryWrappedElement(path.node)) return;
                const unwrapped = unWrapjQueryElement(path.node);
                if (!isStringLiteral(unwrapped)) return;
                path.replaceWith(replaceAstTemplate({SELECTOR: unwrapped}));
            },
        },
    }),
};
