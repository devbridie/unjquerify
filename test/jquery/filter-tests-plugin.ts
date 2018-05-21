import {assignmentExpression, expressionStatement, identifier, memberExpression, stringLiteral} from "babel-types";
import {Visitor} from "babel-traverse";

const escapeStringRegexp = require("escape-string-regexp");

export function filterTestsPlugin(testNames: string[]) {
    return ({
        visitor: {
            Program: (nodePath) => {
                const config = memberExpression(identifier("QUnit"), identifier("config"));
                const filter = memberExpression(config, identifier("filter"));
                const regexString = testNames.map((name) => escapeStringRegexp(name)).join("|");
                const regexLit = stringLiteral(`!/${regexString}/`);
                const assignment = assignmentExpression("=", filter, regexLit);
                (nodePath as any).unshiftContainer("body", expressionStatement(assignment));
            },
        } as Visitor<any>,
    });
}
