import {arrayExpression, callExpression, identifier, memberExpression, spreadElement} from "babel-types";
import {Plugin} from "../../../model/plugin";
import {CallExpressionOfjQueryCollection} from "../../../model/matchers/call-expression-of-jquery-collection";
import {ReturnValue} from "../../../model/return-types/return-value";
import {arrayCollector} from "../../../util/collectors";

export const FindPlugin: Plugin = {
    returnType: new ReturnValue(),
    matchesExpressionType: new CallExpressionOfjQueryCollection("find"),
    applicableWithArguments: (args) => args.length === 1,
    replaceWith: (element, [selector], scope) => {
        const map = arrayCollector(element, "map", scope.generateUidIdentifier("element"), (e) => {
            const querySelectorAll = memberExpression(e, identifier("querySelectorAll"));
            return callExpression(querySelectorAll, [selector]);
        });
        const concat = memberExpression(arrayExpression(), identifier("concat"));
        return callExpression(concat, [spreadElement(map)]);
    },
};
