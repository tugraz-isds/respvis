import {Selection} from "d3";
import {SVGHTMLElementLegacy} from "../../constants/types";
import {Window} from "./window";
import {elementFromSelection} from "../../utilities";
import {renderTooltip} from "respvis-tooltip";

export function renderWindow<D extends Window>(windowS: Selection<SVGHTMLElementLegacy, D>) {
  const data = windowS.datum()
  windowS.classed('window-rv', true)
    .classed(`window-rv-${data.type}`, true)
  data.breakpoints.updateCSSVars(elementFromSelection(windowS))

  if (data.tooltip.active) {
    renderTooltip()
  }

  return windowS
}
