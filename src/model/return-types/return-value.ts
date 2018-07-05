import {ReturnType} from "./return-type";
import {Expression} from "babel-types";
import {Scope} from "babel-traverse";

export class ReturnValue extends ReturnType {
    public constructor(public collector: (array: Expression, scope: Scope, singleElement: Expression) => Expression) {
        super();
    }
}
