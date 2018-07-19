import {stringLiteral} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {CallExpressionOfjQueryCollection} from "../../../model/matchers/call-expression-of-jquery-collection";
import {ReturnSelf} from "../../../model/return-types/return-self";
import {addEventListenerCall} from "../event-handler-attachment/on.plugin";

export const ClickAttachPlugin: Plugin = {
    returnType: new ReturnSelf(),
    matchesExpressionType: new CallExpressionOfjQueryCollection("click"),
    applicableWithArguments: (args) => args.length === 1,
    replaceWith: (element, [handler]) => {
        return addEventListenerCall(element, stringLiteral("click"), handler);
    },
};
