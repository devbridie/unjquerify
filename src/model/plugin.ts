import {JQueryExpressionType} from "./matchers/jquery-expression-type";
import {ReturnType} from "./return-types/return-type";
import {Expression, SpreadElement, Statement} from "babel-types";
import {Scope} from "babel-traverse";

export interface Plugin {
    matchesExpressionType: JQueryExpressionType;
    applicableWithArguments: (args: Array<Expression | SpreadElement>) => boolean;
    returnType: ReturnType;
    replaceWith: (element: Expression, args: Expression[], scope: Scope) => Expression | Statement[];
    escapeFromChain?: true;
}
