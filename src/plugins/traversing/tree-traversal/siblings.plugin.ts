import {Plugin} from "../../../model/plugin";
import {CallExpressionOfjQueryCollection} from "../../../model/matchers/call-expression-of-jquery-collection";
import {ReturnValue} from "../../../model/return-types/return-value";
import {flatMapNodeList} from "../../../util/babel";

import "../../../types/babel-template";
import * as babeltemplate from "@babel/template";
import {arrowFunctionExpression} from "babel-types";

const template = babeltemplate.expression("[...ELEMENT.parentNode.children].filter(PARAM => PARAM !== ELEMENT)");
const templateSelector = babeltemplate.expression("[...ELEMENT.parentNode.children].filter(PARAM => (PARAM !== ELEMENT)"
    + "&& PARAM.matches(SELECTOR))");

export const SiblingsPlugin: Plugin = {
    returnType: new ReturnValue(),
    matchesExpressionType: new CallExpressionOfjQueryCollection("siblings"),
    applicableWithArguments: (args) => args.length === 0 || args.length === 1,
    replaceWith: (element, [selector], scope) => {
        const flatMapId = scope.generateUidIdentifier("parent");
        if (selector) {
            return flatMapNodeList(element, arrowFunctionExpression([flatMapId], templateSelector({
                ELEMENT: flatMapId,
                PARAM: scope.generateUidIdentifier("element"),
                SELECTOR: selector,
            })));
        } else {
            return flatMapNodeList(element, arrowFunctionExpression([flatMapId], template({
                ELEMENT: flatMapId,
                PARAM: scope.generateUidIdentifier("element"),
            })));
        }
    },
};
