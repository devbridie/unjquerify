import {identifier, memberExpression} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {CallExpressionOfjQueryCollection} from "../../../model/matchers/call-expression-of-jquery-collection";
import {firstOfArray} from "../../../util/collectors";
import {ReturnValue} from "../../../model/return-types/return-value";

export const HtmlGetPlugin: Plugin = {
    returnType: new ReturnValue(),
    matchesExpressionType: new CallExpressionOfjQueryCollection("html"),
    applicableWithArguments: (args) => args.length === 0,
    replaceWith: (element) => memberExpression(firstOfArray(element), identifier("innerHTML")),
};
