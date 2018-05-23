import {OnPlugin} from "../event-handler-attachment/on.plugin";
import {Visitor} from "babel-traverse";

export const ClickHandlerPlugin: () => { visitor: Visitor } = OnPlugin("click");
