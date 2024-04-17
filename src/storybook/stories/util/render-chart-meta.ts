import type {StoryContext} from "@storybook/html";
import {RawCSSHandler} from "./raw-css-handler";
import {copyFunctions} from "../charts/line-chart/apply-function-args";
import {renderChartWindow} from "./render-chart-window";

let onDocumentLoad: (e) => void
let cssHandler: RawCSSHandler
export const renderChartMeta = <T extends object>(args: T, context: StoryContext<T>, render: (args: T, id: string) => void) => {
  cssHandler?.removeFromHead()
  cssHandler = new RawCSSHandler(context.parameters.sources?.css?.code ?? '')
  cssHandler.addToHead()
  copyFunctions(context.initialArgs, args)
  const {chartWindow, id} = renderChartWindow()
  document.removeEventListener("DOMContentLoaded", onDocumentLoad)
  onDocumentLoad = () => {
    render(args, id)
  }
  document.addEventListener("DOMContentLoaded", onDocumentLoad)
  return chartWindow
}
