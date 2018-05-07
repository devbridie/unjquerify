import * as babel from "babel-core";

import {isStringLiteral, stringLiteral} from "babel-types";

import {isJQueryWrappedElement, unWrapjQueryElement} from "../../util/jquery-heuristics";

const template = require("@babel/template");

const replaceAstTemplate = template.expression(`$(document.getElementsByClassName(CLASSNAME))`,
    {placeholderPattern: /^[_A-Z0-9]+$/},
);

export const GetElementsByClassNamePlugin = () => ({
    visitor: {
        /*
            $(".<class>") => $(document.getElementsByClassName("<class>"))
         */
        CallExpression: (path) => {
            if (!isJQueryWrappedElement(path.node)) return;
            const unwrapped = unWrapjQueryElement(path.node);
            if (!isStringLiteral(unwrapped)) return;
            const literal = unwrapped.value;
            if (!/^\.[a-zA-Z0-9]+$/.test(literal)) return;
            const cssClass = literal.slice(1);
            const newLiteral = stringLiteral(cssClass);
            path.replaceWith(replaceAstTemplate({CLASSNAME: newLiteral}));
        },
    } as babel.Visitor<{}>,
});
