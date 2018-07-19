import {callExpression, Expression, identifier, memberExpression} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {CallExpressionOfjQueryCollection} from "../../../model/matchers/call-expression-of-jquery-collection";
import {ReturnSelf} from "../../../model/return-types/return-self";

export function addEventListenerCall(element: Expression, eventName: Expression, handler: Expression): Expression {
    const addEventListener = memberExpression(element, identifier("addEventListener"));
    return callExpression(addEventListener, [eventName, handler]);
}

export const OnPlugin: Plugin = {
    returnType: new ReturnSelf(),
    matchesExpressionType: new CallExpressionOfjQueryCollection("on"),
    applicableWithArguments: (args) => args.length === 2,
    replaceWith: (element, [eventName, handler]) => {
        return addEventListenerCall(element, eventName, handler);
    },
};
