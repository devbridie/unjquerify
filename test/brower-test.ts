import * as assert from "assert";
import * as babel from "babel-core";
import puppeteer, {Browser, Page} from "puppeteer";

export interface BrowserTest {
    code: string;
    plugin: () => any;
    resultRequiresJquery: boolean;
    testFunction: (before: Promise<Page>, after: Promise<Page>) => any;
}

async function addjQuery(page: Page) {
    await page.addScriptTag({path: require.resolve("jquery/dist/jquery")});
}

export async function assertEqualResult(page1: Page, page2: Page, code: string, description?: string) {
    assert.equal(await page1.evaluate(code), await page2.evaluate(code), description);
}

export function executeBrowserTests(tests: BrowserTest[]) {
    describe("equivalence", async () => {
        const browser: Promise<Browser> = (async () => {
            return await puppeteer.launch();
        })();

        before(async () => {
            await browser;
        });

        after(async () => {
            await (await browser).close();
        });

        tests.forEach((test) => {
            describe(`with code ${test.code}`, () => {
                const page1: Promise<Page> = (async () => {
                    const page = await (await browser).newPage();
                    await addjQuery(page);
                    await page.evaluate(test.code);
                    return page;
                })();
                const page2: Promise<Page> = (async () => {
                    const transformed = babel.transform(test.code, {plugins: [test.plugin]}).code as string;
                    const page = await (await browser).newPage();
                    if (test.resultRequiresJquery) {
                        await addjQuery(page);
                    }
                    await page.evaluate(transformed as string);
                    return page;
                })();

                before(async () => {
                    await browser;
                });

                beforeEach(async () => {
                    await Promise.all([page1, page2]);
                });
                test.testFunction(page1, page2);
            });
        });
    });
}
