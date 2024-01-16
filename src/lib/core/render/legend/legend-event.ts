import {LegendSelection} from "./legend-render";
import {select, Selection} from "d3";
import {ErrorMessages} from "../../utilities/error";
import {splitKey} from "../../utilities/dom/key";
import {LegendItem} from "./legend-item-validation";

export function legendAddHover(selection: LegendSelection) {
  const legend= selection.datum()
  const chartS = legend.renderer.chartSelection
  if (!chartS) throw new Error(ErrorMessages.elementNotExisting)
  const drawAreaS = selection.selectAll('.draw-area')
  //TODO: Hover General for all charts
  return chartS.on('pointerover.chartpointhighlight pointerout.chartpointhighlight', (e) => {
      chartPointHoverLegendItem(
        drawAreaS,
        select(e.target.closest('.legend-item')),
        e.type.endsWith('over')
      );
    });
}

function chartPointHoverLegendItem(
  chartS: Selection,
  legendItemS: Selection<Element, LegendItem>,
  hover: boolean
): void {
  legendItemS.each((_, i, g) => {
    const key = g[i].getAttribute('data-key')!
    const tokens = splitKey(key)
    tokens.reduce((sel, token, index) => {
      if (index === 0) return sel.selectAll(`.point[data-key~="${token}"]`)
      return sel.filter(`.point[data-key~="${token}"]`)
    }, chartS).classed('highlight', hover)
  });
}
