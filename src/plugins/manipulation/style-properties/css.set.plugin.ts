import {callExpression, identifier, memberExpression} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {CallExpressionOfjQueryCollection} from "../../../model/matchers/call-expression-of-jquery-collection";
import {ReturnSelf} from "../../../model/return-types/return-self";

export const CssSetPlugin: Plugin = {
    returnType: new ReturnSelf(),
    matchesExpressionType: new CallExpressionOfjQueryCollection("css"),
    applicableWithArguments: (args) => args.length === 2,
    replaceWith: (element, [property, value], scope) => {
        const setAttribute = memberExpression(element, identifier("setAttribute"));
        return callExpression(setAttribute, [property, value]);
    },
};
