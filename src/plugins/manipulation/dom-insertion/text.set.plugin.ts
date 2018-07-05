import {assignmentExpression, identifier, memberExpression} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {CallExpressionOfjQueryCollection} from "../../../model/matchers/call-expression-of-jquery-collection";
import {ReturnSelf} from "../../../model/return-types/return-self";

export const TextSetPlugin: Plugin = {
    returnType: new ReturnSelf(),
    matchesExpressionType: new CallExpressionOfjQueryCollection("text"),
    applicableWithArguments: (args) => args.length === 1,
    replaceWith: (element, [text]) => {
        const textContent = memberExpression(element, identifier("textContent"));
        return assignmentExpression("=", textContent, text);
    },
};
