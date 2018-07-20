import {Plugin} from "../../model/plugin";
import {ReturnSelf} from "../../model/return-types/return-self";
import {CallExpressionOfjQueryCollection} from "../../model/matchers/call-expression-of-jquery-collection";
import {
    arrowFunctionExpression,
    callExpression,
    identifier,
    isStringLiteral,
    memberExpression,
    spreadElement,
    StringLiteral,
    stringLiteral,
} from "babel-types";

export const ToggleClassPlugin: Plugin = {
    returnType: new ReturnSelf(),
    matchesExpressionType: new CallExpressionOfjQueryCollection("toggleClass"),
    applicableWithArguments: (args) => args.length === 1,
    replaceWith: (element, [clz], scope) => {
        const classList = memberExpression(element, identifier("classList"));
        const toggle = memberExpression(classList, identifier("toggle"));
        return callExpression(toggle, [clz]);
    },
};
