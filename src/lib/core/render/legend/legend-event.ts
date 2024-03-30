import {LegendSelection} from "./legend-render";
import {select, Selection} from "d3";
import {ErrorMessages} from "../../utilities/error";
import {splitKey} from "../../utilities/dom/key";
import {LegendItem} from "./legend-item-validation";

export function legendAddHover(legendS: LegendSelection) {
  const legend= legendS.datum()
  const chartS = legend.renderer.chartS
  if (!chartS) throw new Error(ErrorMessages.elementNotExisting)
  const drawAreaS = chartS.selectAll('.draw-area')
  //TODO: Hover General for all charts
  return legendS.on('pointerover.chartpointhighlight pointerout.chartpointhighlight', (e) => {
      chartHoverLegendItem(
        drawAreaS,
        select(e.target.closest('.legend-item')),
        e.type.endsWith('over')
      );
    });
}

function chartHoverLegendItem(
  chartS: Selection,
  legendItemS: Selection<Element, LegendItem>,
  hover: boolean
): void {
  legendItemS.each((_, i, g) => {
    const key = g[i].getAttribute('data-key')!
    const tokens = splitKey(key)
    tokens.reduce((sel, token, index) => {
      if (index === 0) return sel.selectAll(`.element[data-key~="${token}"]`)
      return sel.filter(`.element[data-key~="${token}"]`)
    }, chartS).classed('highlight', hover)
  });
}
