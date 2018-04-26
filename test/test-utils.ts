import * as babel from "babel-core";
import {ExpressionStatement, Node} from "babel-types";
import * as types from "babel-types";
import puppeteer, {Browser} from "puppeteer";

export function stringToSingleExpression(code: string, plugins: babel.PluginObj[] = []): Node {
    const transformation = babel.transform(code, { plugins });
    const program = (transformation.ast as types.File).program;
    return (program.body[0] as ExpressionStatement).expression;
}
