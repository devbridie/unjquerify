import "jest";
import * as babel from "babel-core";
import {jQueryExpressionPlugin} from "../../src/plugins/jquery-expression.plugin";

describe("unchain", () => {
    describe("as statement", () => {
        test("transforms mutationless expression correctly", () => {
            const example = `$("a").addClass("clazz").hide().css("font-size",12);`;
            const transformed = babel.transform(example, {plugins: [jQueryExpressionPlugin([])]}).code;
            expect(transformed).toMatchSnapshot();
        });

        test("transforms mutated expression correctly", () => {
            const example = `$("div").addClass("clazz").find("a").css("font-size",12);`;
            const transformed = babel.transform(example, {plugins: [jQueryExpressionPlugin([])]}).code;
            expect(transformed).toMatchSnapshot();
        });
    });

    describe("as assignment rval", () => {
        test("transforms mutationless expression correctly value", () => {
            const example = `const as = $("a").addClass("clazz").hide().css("font-size",12);`;
            const transformed = babel.transform(example, {plugins: [jQueryExpressionPlugin([])]}).code;
            expect(transformed).toMatchSnapshot();
        });

        test("transforms mutationless expression correctly", () => {
            const example = `const fontSize = $("a").addClass("clazz").hide().css("font-size");`;
            const transformed = babel.transform(example, {plugins: [jQueryExpressionPlugin([])]}).code;
            expect(transformed).toMatchSnapshot();
        });

        test("transforms mutated expression correctly", () => {
            const example = `const fontSize = $("div").addClass("clazz").css("font-size");`;
            const transformed = babel.transform(example, {plugins: [jQueryExpressionPlugin([])]}).code;
            expect(transformed).toMatchSnapshot();
        });

        test("transforms child mutated expression correctly as value", () => {
            const example = `const fontSize = $("div").addClass("clazz").find("a").css("font-size");`;
            const transformed = babel.transform(example, {plugins: [jQueryExpressionPlugin([])]}).code;
            expect(transformed).toMatchSnapshot();
        });
    });

    describe("short chain", () => {
        test("transforms self", () => {
            const example = `const as = $("a").addClass("clazz");`;
            const transformed = babel.transform(example, {plugins: [jQueryExpressionPlugin([])]}).code;
            expect(transformed).toMatchSnapshot();
        });
    });
});