import {
    callExpression,
    identifier,
    isStringLiteral,
    memberExpression,
    spreadElement,
    stringLiteral,
} from "babel-types";
import {Plugin} from "../../model/plugin";
import {CallExpressionOfjQueryCollection} from "../../model/matchers/call-expression-of-jquery-collection";
import {ReturnSelf} from "../../model/return-types/return-self";
import {nestedMemberExpressions} from "../../util/babel";

export const AddClassPlugin: Plugin = {
    returnType: new ReturnSelf(),
    matchesExpressionType: new CallExpressionOfjQueryCollection("addClass"),
    applicableWithArguments: (args) => args.length === 1,
    replaceWith: ((element, [arg]) => {
        const classListAdd = nestedMemberExpressions(element, ["classList", "add"]);
        if (isStringLiteral(arg)) {
            const classes = arg.value.split(" ");
            return callExpression(classListAdd, classes.map(name => stringLiteral(name)));
        } else {
            const split = memberExpression(arg, identifier("split"));
            const callSplit = callExpression(split, [stringLiteral(" ")]);
            return callExpression(classListAdd, [spreadElement(callSplit)]);
        }
    }),
};
