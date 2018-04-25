import * as assert from "assert";
import "mocha";
import * as util from "../../src/util/jquery-heuristics";
import {stringToSingleExpression} from "../test-utils";

describe("jQuery heuristics", () => {
    it("should detect $(document)", () => {
        const node = stringToSingleExpression("$(document)");
        assert.equal(util.isJQueryWrappedElement(node), true);
    });

    it("should detect jQuery(document)", () => {
        const node = stringToSingleExpression("jQuery(document)");
        assert.equal(util.isJQueryWrappedElement(node), true);
    });

    it("should not detect test(a)", () => {
        const node = stringToSingleExpression("test(a)");
        assert.equal(util.isJQueryWrappedElement(node), false);
    });
});
