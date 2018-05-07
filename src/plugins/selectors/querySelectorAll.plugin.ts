import * as babel from "babel-core";

import {isStringLiteral} from "babel-types";

import {isJQueryWrappedElement, unWrapjQueryElement} from "../../util/jquery-heuristics";

const template = require("@babel/template");

const replaceAstTemplate = template.expression(`$(document.querySelectorAll(SELECTOR))`,
    {placeholderPattern: /^[_A-Z0-9]+$/},
);

export const QuerySelectorAllPlugin = () => ({
    visitor: {
        /*
            $("<selector>") => $(document.querySelectorAll("<selector>"))
         */
        CallExpression: (path) => {
            if (!isJQueryWrappedElement(path.node)) return;
            const unwrapped = unWrapjQueryElement(path.node);
            if (!isStringLiteral(unwrapped)) return;
            path.replaceWith(replaceAstTemplate({SELECTOR: unwrapped}));
        },
    } as babel.Visitor<{}>,
});
