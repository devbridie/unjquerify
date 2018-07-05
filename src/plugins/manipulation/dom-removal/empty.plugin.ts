import {assignmentExpression, identifier, memberExpression, stringLiteral} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {CallExpressionOfjQueryCollection} from "../../../model/matchers/call-expression-of-jquery-collection";
import {ReturnSelf} from "../../../model/return-types/return-self";

export const EmptyPlugin: Plugin = {
    returnType: new ReturnSelf(),
    matchesExpressionType: new CallExpressionOfjQueryCollection("empty"),
    applicableWithArguments: (args) => args.length === 0,
    replaceWith: (element, []) => {
        const innerHTML = memberExpression(element, identifier("innerHTML"));
        return assignmentExpression("=", innerHTML, stringLiteral(""));
    },
};
