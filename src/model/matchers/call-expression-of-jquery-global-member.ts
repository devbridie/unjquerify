import {JQueryExpressionType} from "./jquery-expression-type";

// Shaped like $.a();
export class CallExpressionOfjQueryGlobalMember extends JQueryExpressionType {
    public constructor(public methodName: string) { super(); }
}
