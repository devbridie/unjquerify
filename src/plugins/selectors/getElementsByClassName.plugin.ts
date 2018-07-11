import {callExpression, identifier, isStringLiteral, memberExpression, StringLiteral, stringLiteral} from "babel-types";
import {Plugin} from "../../model/plugin";
import {CallExpressionOfjQueryGlobal} from "../../model/matchers/call-expression-of-jquery-global";
import {ReturnValue} from "../../model/return-types/return-value";

export const GetElementsByClassNamePlugin: Plugin = {
    returnType: new ReturnValue(),
    matchesExpressionType: new CallExpressionOfjQueryGlobal(),
    applicableWithArguments: (args) => {
        if (args.length !== 0) return false;
        const [arg] = args;
        if (!isStringLiteral(arg)) return false;
        const literal = arg.value;
        if (!/^\.[a-zA-Z0-9]+$/.test(literal)) return false;
        return true;
    },
    replaceWith: (element, args) => {
        const arg = args[0] as StringLiteral;
        const cssClass = arg.value.slice(1);
        const newLiteral = stringLiteral(cssClass);
        const document = identifier("document");
        const querySelectorAll = memberExpression(document, identifier("getElementsByClassName"));
        return callExpression(querySelectorAll, [newLiteral]);
    },
};
