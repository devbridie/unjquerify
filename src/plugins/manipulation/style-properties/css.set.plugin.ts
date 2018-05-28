import * as babel from "babel-core";
import {
    assignmentExpression,
    expressionStatement,
    identifier,
    isIdentifier,
    isMemberExpression,
    isSpreadElement,
    isStringLiteral,
    memberExpression,
} from "babel-types";
import camelcase from "camelcase";
import {pullOutNativeElement} from "../../../util/jquery-heuristics";

export const CssSetPlugin = () => ({
    visitor: {
        /*
            $el.css("color", "red") => el.style.color = "red"
         */
        CallExpression: (path) => {
            const node = path.node;
            if (!isMemberExpression(node.callee)) return;
            if (!(isIdentifier(node.callee.property) && node.callee.property.name === "css")) return;
            const [firstArg, secondArg] = path.node.arguments;
            if (!(isStringLiteral(firstArg) && secondArg)) return;

            const el = pullOutNativeElement(node.callee.object);

            const style = memberExpression(el, identifier("style"));

            if (isStringLiteral(firstArg) && !isSpreadElement(secondArg)) {
                const propertyName = firstArg.value;
                const property = memberExpression(style, identifier(camelcase(propertyName)));
                const assignment = assignmentExpression("=", property, secondArg);
                path.replaceExpressionWithStatements([expressionStatement(assignment)]);
            }
            // TODO other cases
        },
    } as babel.Visitor<{}>,
});
