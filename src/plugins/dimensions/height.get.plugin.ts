import {ReturnValue} from "../../model/return-types/return-value";
import {CallExpressionOfjQueryCollection} from "../../model/matchers/call-expression-of-jquery-collection";
import {Plugin} from "../../model/plugin";
import {firstOfArray} from "../../util/collectors";
import {identifier, memberExpression} from "babel-types";

export const HeightGetPlugin: Plugin = {
    returnType: new ReturnValue(),
    matchesExpressionType: new CallExpressionOfjQueryCollection("height"),
    applicableWithArguments: (args) => args.length === 0,
    replaceWith: (element) => {
        return memberExpression(firstOfArray(element), identifier("clientHeight"));
    },
};
