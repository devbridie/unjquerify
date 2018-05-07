import "mocha";
import {assertEqualResult, executeBrowserTestSuite} from "../browser-test";
import {UnchainPlugin} from "../../src/plugins/unchain.plugin";
import {Page} from "puppeteer";

describe("unchain plugin", () => {
    executeBrowserTestSuite({
            code: `$(document).text("test").addClass("hidden")`,
            plugins: [UnchainPlugin],
            postTransformRequiresJquery: true,
            tests: [
                {
                    name: "should have executed the first statement",
                    func: async (before: Page, after: Page) => {
                        await assertEqualResult(before, after, `$(document).text()`);
                    },
                },
                {
                    name: "should have executed the second statement",
                    func: async (before: Page, after: Page) => {
                        await assertEqualResult(before, after, `$(document).hasClass("hidden")`);
                    },
                },
            ],
        });
    executeBrowserTestSuite({
        code: `$('body').append('a').append('b').append('c')`,
        plugins: [UnchainPlugin],
        postTransformRequiresJquery: true,
        tests: [
            {
                name: "should have been executed in the correct order",
                func: async (before: Page, after: Page) => {
                    await assertEqualResult(before, after, `$('body').text()`);
                },
            },
        ],
    });
});
