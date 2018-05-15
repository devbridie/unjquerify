import "mocha";
import {assertEqualResult, executeBrowserTestSuite, executeCode} from "../../../browser-test";
import {CssGetPlugin} from "../../../../src/plugins/manipulation/style-properties/css.get.plugin";
import {Page} from "puppeteer";

describe("css get plugin", () => {
    executeBrowserTestSuite({
        async before(page1: Page, page2: Page) {
            await executeCode(`document.body.style.cssText = "color: #f00; background-color: black;"`, page1, page2);
        },
        code: `window.test = $('body').css('color'); window.testbg = $('body').css('background-color');`,
        postTransformRequiresJquery: true,
        plugins: [CssGetPlugin],
        tests: [
            {
                name: "should return the same result for 'color'",
                func: async (before: Page, after: Page) => {
                    await assertEqualResult(before, after, `window.test`);
                },
            },
            {
                name: "should return the same result for 'background-color'",
                func: async (before: Page, after: Page) => {
                    await assertEqualResult(before, after, `window.testbg`);
                },
            },
        ],
    });
});
