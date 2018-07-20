import {ReturnSelf} from "../../model/return-types/return-self";
import {Plugin} from "../../model/plugin";
import {CallExpressionOfjQueryCollection} from "../../model/matchers/call-expression-of-jquery-collection";
import {assignmentExpression, identifier, memberExpression} from "babel-types";

export const ValSetPlugin: Plugin = {
    returnType: new ReturnSelf(),
    matchesExpressionType: new CallExpressionOfjQueryCollection("val"),
    applicableWithArguments: (args) => args.length === 1,
    replaceWith: (element, [newValue]) => {
        const valueProperty = memberExpression(element, identifier("value"));
        return assignmentExpression("=", valueProperty, newValue);
    },
};
