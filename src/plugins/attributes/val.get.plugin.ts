import {Plugin} from "../../model/plugin";
import {CallExpressionOfjQueryCollection} from "../../model/matchers/call-expression-of-jquery-collection";
import {identifier, memberExpression} from "babel-types";
import {firstOfArray} from "../../util/collectors";
import {ReturnValue} from "../../model/return-types/return-value";

export const ValGetPlugin: Plugin = {
    returnType: new ReturnValue(),
    matchesExpressionType: new CallExpressionOfjQueryCollection("val"),
    applicableWithArguments: (args) => args.length === 0,
    replaceWith: (element) => {
        return memberExpression(firstOfArray(element), identifier("value"));
    },
};
