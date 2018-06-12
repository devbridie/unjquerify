import * as assert from "assert";
import "mocha";
import * as util from "../../src/util/jquery-heuristics";
import {stringToSingleExpression} from "../test-utils";

describe("jQuery heuristics", () => {
    describe("isJQueryWrappedElement", () => {
        it("should detect $(document)", () => {
            const node = stringToSingleExpression("$(document)");
            assert.ok(util.unWrapjQueryElement(node));
        });

        it("should detect jQuery(document)", () => {
            const node = stringToSingleExpression("jQuery(document)");
            assert.ok(util.unWrapjQueryElement(node));
        });

        it("should not detect test(a)", () => {
            const node = stringToSingleExpression("test(a)");
            assert.ok(!util.unWrapjQueryElement(node));
        });
    });

    describe("isCallOnjQuery", () => {
        it(`should detect a.hide()`, () => {
            const node = stringToSingleExpression("a.hide()");
            assert.ok(util.isCallOnjQuery(node, "hide"));
        });
        it(`should detect $("a").hide()`, () => {
            const node = stringToSingleExpression(`$("a").hide()`);
            assert.ok(util.isCallOnjQuery(node, "hide"));
        });
        it(`should not detect [5].hide()`, () => {
            const node = stringToSingleExpression(`[5].hide()`);
            assert.ok(!util.isCallOnjQuery(node, "hide"));
        });
        it(`should check for the correct method name`, () => {
            const node = stringToSingleExpression(`$("a").hide()`);
            assert.ok(!util.isCallOnjQuery(node, "show"));
        });
    });
});
