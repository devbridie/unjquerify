import {arrowFunctionExpression, identifier, memberExpression} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {CallExpressionOfjQueryCollection} from "../../../model/matchers/call-expression-of-jquery-collection";
import {ReturnValue} from "../../../model/return-types/return-value";
import {flatMapNodeList} from "../../../util/babel";

export const ContentsPlugin: Plugin = {
    returnType: new ReturnValue(),
    matchesExpressionType: new CallExpressionOfjQueryCollection("contents"),
    applicableWithArguments: (args) => args.length === 0,
    replaceWith: (element, [selector], scope) => {
        const param = scope.generateUidIdentifier("parent");
        const childNodes = memberExpression(param, identifier("childNodes"));
        return flatMapNodeList(element, arrowFunctionExpression([param], childNodes));
    },
};
