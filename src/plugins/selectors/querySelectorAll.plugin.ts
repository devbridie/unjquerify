import * as babel from "babel-core";

import {isStringLiteral, stringLiteral} from "babel-types";

import {some} from "fp-ts/lib/Option";
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
            some(path.node)
                .filter(node => isJQueryWrappedElement(node))
                .map(wrapped => unWrapjQueryElement(wrapped))
                .mapNullable(unwrapped => isStringLiteral(unwrapped) ? unwrapped : null)
                .map(literal => literal.value)
                .map(selector => selector.slice(1))
                .map(id => stringLiteral(id))
                .map(literal => {
                    path.replaceWith(replaceAstTemplate({SELECTOR: literal}));
                });
        },
    } as babel.Visitor<{}>,
});
