import {callExpression, identifier, memberExpression} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {CallExpressionOfjQueryCollection} from "../../../model/matchers/call-expression-of-jquery-collection";
import {firstOfArray} from "../../../util/collectors";
import {ReturnValue} from "../../../model/return-types/return-value";

export const AttrGetPlugin: Plugin = {
    returnType: new ReturnValue(array => firstOfArray(array)),
    matchesExpressionType: new CallExpressionOfjQueryCollection("attr"),
    applicableWithArguments: (args) => args.length === 1,
    replaceWith: (element, [property]) => {
        const getAttribute = memberExpression(element, identifier("getAttribute"));
        return callExpression(getAttribute, [property]);
    },
};
