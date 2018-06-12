import * as babel from "babel-core";
import * as types from "babel-types";
import {Expression, ExpressionStatement} from "babel-types";

export function stringToSingleExpression(code: string, plugins: babel.PluginObj[] = []): Expression {
    const transformation = babel.transform(code, {plugins});
    const program = (transformation.ast as types.File).program;
    return (program.body[0] as ExpressionStatement).expression;
}
