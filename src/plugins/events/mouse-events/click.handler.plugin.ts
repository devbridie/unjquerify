import {OnPlugin} from "../event-handler-attachment/on.plugin";
import {Plugin} from "../../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";
import {CallExpressionOfjQueryCollection} from "../../../model/call-expression-of-jquery-collection";

export const ClickHandlerPlugin: Plugin = {
    name: "ClickHandlerPlugin",
    path: ["events", "mouse-events", "click.handler"],
    matchesExpressionType: new CallExpressionOfjQueryCollection("click"),
    causesChainMutation: false,
    references: [
        jqueryApiReference("click"),
        mdnReference("EventTarget/addEventListener"),
        youDontNeedJquery("5.1"),
    ],
    fromExample: `$el.click(fn)`,
    toExample: `el.addEventListener("click", fn)`,
    description: `Converts on click calls.`,
    babel: OnPlugin("click").babel,
};
