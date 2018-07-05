import {callExpression} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {CallExpressionOfjQueryCollection} from "../../../model/matchers/call-expression-of-jquery-collection";
import {ReturnSelf} from "../../../model/return-types/return-self";
import {nestedMemberExpressions} from "../../../util/babel";

export const RemovePlugin: Plugin = {
    returnType: new ReturnSelf(),
    matchesExpressionType: new CallExpressionOfjQueryCollection("remove"),
    applicableWithArguments: (args) => args.length === 0,
    replaceWith: (element, []) => {
        const parentRemove = nestedMemberExpressions(element, ["parentNode", "removeChild"]);
        return callExpression(parentRemove, [element]);
    },
};
