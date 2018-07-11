import {callExpression, identifier, memberExpression} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {CallExpressionOfjQueryCollection} from "../../../model/matchers/call-expression-of-jquery-collection";
import {firstOfArray} from "../../../util/collectors";
import {ReturnValue} from "../../../model/return-types/return-value";

export const CssGetPlugin: Plugin = {
    returnType: new ReturnValue(),
    matchesExpressionType: new CallExpressionOfjQueryCollection("css"),
    applicableWithArguments: (args) => args.length === 1,
    replaceWith: (element, [property]) => {
        const computedStyle = callExpression(identifier("getComputedStyle"), [firstOfArray(element)]);
        return memberExpression(computedStyle, property, true);
    },
};
