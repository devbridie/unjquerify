import {OnPlugin} from "../event-handler-attachment/on.plugin";
import {Plugin} from "../../../model/plugin";
import {jqueryApiReference, mdnReference, youDontNeedJquery} from "../../../util/references";

export const ClickHandlerPlugin: Plugin = {
    name: "ClickHandlerPlugin",
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
