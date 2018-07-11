import {assignmentExpression, stringLiteral} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {CallExpressionOfjQueryCollection} from "../../../model/matchers/call-expression-of-jquery-collection";
import {ReturnSelf} from "../../../model/return-types/return-self";
import {nestedMemberExpressions} from "../../../util/babel";

export const HidePlugin: Plugin = {
    returnType: new ReturnSelf(),
    matchesExpressionType: new CallExpressionOfjQueryCollection("hide"),
    applicableWithArguments: (args) => args.length === 0,
    replaceWith: (element) => {
        const styleDisplay = nestedMemberExpressions(element, ["style", "display"]);
        return assignmentExpression("=", styleDisplay, stringLiteral("none"));
    },
};
