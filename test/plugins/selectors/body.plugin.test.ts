import "mocha";
import {assertEqualResult, executeBrowserTestSuite, executeCode} from "../../browser-test";
import {Page} from "puppeteer";
import {BodyPlugin} from "../../../src/plugins/selectors/body.plugin";

describe("css body plugin", () => {
    executeBrowserTestSuite({
        async before(page1: Page, page2: Page) {
            await executeCode(`document.write("test")`, page1, page2);
        },
        code: `window.test = $("body").text()`,
        postTransformRequiresJquery: true,
        plugins: [BodyPlugin],
        tests: [
            {
                name: "should refer to the same element",
                func: async (before: Page, after: Page) => {
                    await assertEqualResult(before, after, `window.test`);
                },
            },
        ],
    });
});
