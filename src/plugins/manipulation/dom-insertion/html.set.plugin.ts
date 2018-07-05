import {assignmentExpression, identifier, memberExpression} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {CallExpressionOfjQueryCollection} from "../../../model/matchers/call-expression-of-jquery-collection";
import {ReturnSelf} from "../../../model/return-types/return-self";

export const HtmlSetPlugin: Plugin = {
    returnType: new ReturnSelf(),
    matchesExpressionType: new CallExpressionOfjQueryCollection("html"),
    applicableWithArguments: (args) => args.length === 1,
    replaceWith: (element, [html]) => {
        const innerHTML = memberExpression(element, identifier("innerHTML"));
        return assignmentExpression("=", innerHTML, html);
    },
};
