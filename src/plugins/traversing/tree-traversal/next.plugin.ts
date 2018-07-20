import {arrowFunctionExpression, callExpression, identifier, memberExpression} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {CallExpressionOfjQueryCollection} from "../../../model/matchers/call-expression-of-jquery-collection";
import {ReturnValue} from "../../../model/return-types/return-value";
import {mapNodeList} from "../../../util/babel";

export const NextPlugin: Plugin = {
    returnType: new ReturnValue(),
    matchesExpressionType: new CallExpressionOfjQueryCollection("next"),
    applicableWithArguments: (args) => args.length === 0 || args.length === 1,
    replaceWith: (element, [selector], scope) => {
        const flatMapId = scope.generateUidIdentifier("element");
        const next = memberExpression(flatMapId, identifier("nextElementSibling"));
        const map = mapNodeList(element, arrowFunctionExpression([flatMapId], next));
        if (selector) {
            const matches = memberExpression(flatMapId, identifier("matches"));
            const matchesCall = callExpression(matches, [selector]);
            const filterLambda = arrowFunctionExpression([flatMapId], matchesCall);
            return callExpression(memberExpression(map, identifier("filter")), [filterLambda]);
        } else {
            return map;
        }
    },
};
