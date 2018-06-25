import {JQueryExpressionType} from "./jquery-expression-type";

// Shaped like $("").a();
export class CallExpressionOfjQueryCollection extends JQueryExpressionType {
    public constructor(public methodName: string) { super(); }
}
