import {Page} from "puppeteer";
import {UnchainPlugin} from "../../src/plugins/unchain.plugin";
import {assertEqualResult, BrowserTest} from "../brower-test";

const tests: BrowserTest[] = [
    {
        code: `$(document).text("test").addClass("hidden")`,
        plugin: UnchainPlugin,
        resultRequiresJquery: true,
        testFunction: async (before: Promise<Page>, after: Promise<Page>) => {
            it("should have executed the first statement", async () => {
                await assertEqualResult(await before, await after, `$(document).text()`);
            });

            it("should have executed the second statement", async () => {
                await assertEqualResult(await before, await after, `$(document).hasClass("hidden")`);
            });
        },
    },
    {
        code: `$(document).addClass("test3").addClass("hidden").addClass("test")`,
        plugin: UnchainPlugin,
        resultRequiresJquery: true,
        testFunction: async (before: Promise<Page>, after: Promise<Page>) => {
            it("should have executed the first statement", async () => {
                await assertEqualResult(await before, await after, `$(document).hasClass("test3")`);
            });

            it("should have executed the second statement", async () => {
                await assertEqualResult(await before, await after, `$(document).hasClass("hidden")`);
            });

            it("should have executed the third statement", async () => {
                await assertEqualResult(await before, await after, `$(document).hasClass("test")`);
            });
        },
    },
] as BrowserTest[];

export default tests;
