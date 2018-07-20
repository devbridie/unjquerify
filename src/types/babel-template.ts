declare module "@babel/template" {
    import {Expression, Statement} from "babel-types";

    export function statements(template: string): (params: any) => Statement[];
    export function expression(template: string): (params: any) => Expression;
}
