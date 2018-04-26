import "mocha";
import {executeBrowserTests} from "../brower-test";

describe("unchain plugin", () => {
    executeBrowserTests(require("./unchain.plugin.eq.spec").default);
});
