import {assertEqualResult, executeBrowserTestSuite, executeCode} from "../../../browser-test";
import {Page} from "puppeteer";
import {CssSetPlugin} from "../../../../src/plugins/manipulation/style-properties/css.set.plugin";
import * as assert from "assert";

describe("css set plugin", () => {
    executeBrowserTestSuite({
        async before(page1: Page, page2: Page) {
            await executeCode(`document.body.style.cssText = "color: #f00; background-color: black;"`, page1, page2);
        },
        code: `$('body').css('color', "#f0f0f0");
               window.testcolor = $('body').css('color');
               $('body').css('background-color', "red");
               window.testbgcolor = $('body').css('background-color');`,
        postTransformRequiresJquery: true,
        plugins: [CssSetPlugin],
        tests: [
            {
                name: "should return the same result for 'color'",
                func: async (before: Page, after: Page) => {
                    await assertEqualResult(before, after, `window.testcolor`);
                    assert.equal(await before.evaluate(`window.testcolor`), "rgb(240, 240, 240)",
                        "Should have done a mutation");
                },
            },
            {
                name: "should return the same result for 'background-color'",
                func: async (before: Page, after: Page) => {
                    await assertEqualResult(before, after, `window.testbgcolor`);
                    assert.equal(await before.evaluate(`window.testbgcolor`), "rgb(255, 0, 0)",
                        "Should have done a mutation");
                },
            },
        ],
    });
});
