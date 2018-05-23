import * as assert from "assert";
import * as babel from "babel-core";
import puppeteer, {Browser, Page} from "puppeteer";

/**
 * Describes an equivalence browser test.
 * Such a test will confirm that properties are maintained after a transformation using a given plugin.
 */
export interface BrowserTestSuite {
    /**
     * A hook to run initializing code, after the page is loaded, but before the transformed or original code is run.
     */
    before?: (page1: Page, page2: Page) => Promise<any>;
    /**
     * The code that will be transformed. It is run once in jQuery context, and again after code transformation.
     */
    code: string;
    /**
     * The plugins that will be used for code transformation.
     */
    plugins: Array<() => any>;
    /**
     * Describes if the second test page requires jQuery for verification. Useful for jQuery to jQuery transformations.
     */
    postTransformRequiresJquery?: boolean;
    /**
     * The tests to be run in this suite.
     */
    tests: BrowserTest[];
}
export interface BrowserTest {
    name: string;
    func: (before: Page, after: Page) => any;
}

export interface TestContainer {
    browser?: Browser;
    preTransformPage?: Page;
    postTransformPage?: Page;
}

/**
 * Helper function to add jQuery to a page.
 */
async function addjQuery(page: Page) {
    await page.addScriptTag({path: require.resolve("jquery/dist/jquery")});
}

/**
 * Executes the same code in two pages.
 */
export async function executeCode(code: string, page1: Page, page2: Page) {
    await page1.evaluate(code);
    await page2.evaluate(code);
}

/**
 * Helper function to check that the same code evaluates to the same result.
 */
export async function assertEqualResult(page1: Page,
                                        page2: Page,
                                        code: string,
                                        description: string = `Should return an equivalent result for code ${code}`) {
    assert.deepStrictEqual(await page1.evaluate(code), await page2.evaluate(code), description);
}

export function executeBrowserTestSuite(suite: BrowserTestSuite) {
    describe("equivalence", async () => {
        const browserContainer: TestContainer = {};

        before(async () => {
            browserContainer.browser = await puppeteer.launch();
        });

        after(async () => {
            if (browserContainer.browser) {
                await browserContainer.browser.close();
            }
        });

        describe(`using code ${suite.code}`, () => {
            beforeEach(async () => {
                if (browserContainer.browser) {
                    const preTransformPage = await browserContainer.browser.newPage();
                    browserContainer.preTransformPage = preTransformPage;
                    await addjQuery(preTransformPage);

                    const postTransformPage = await browserContainer.browser.newPage();
                    browserContainer.postTransformPage = postTransformPage;
                    if (suite.postTransformRequiresJquery) {
                        await addjQuery(postTransformPage);
                    }
                    if (suite.before) {
                        await suite.before(preTransformPage, postTransformPage);
                    }
                    const transformed = babel.transform(suite.code, {plugins: suite.plugins}).code as string;
                    console.log("preTransformPage", suite.code);
                    await preTransformPage.evaluate(suite.code);
                    console.log("postTransformPage", transformed);
                    await postTransformPage.evaluate(transformed);
                } else {
                    assert.fail("Browser not initialized.");
                }
            });
            suite.tests.forEach(test => {
                it(test.name, async () => {
                    if (browserContainer.preTransformPage && browserContainer.postTransformPage) {
                        await test.func(browserContainer.preTransformPage, browserContainer.postTransformPage);
                    } else {
                        assert.fail("Page not initialized");
                    }
                });
            });
        });
    });
}
