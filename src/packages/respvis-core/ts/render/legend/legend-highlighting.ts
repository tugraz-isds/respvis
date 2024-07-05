import {LegendSelection} from "./render-legend";
import {select, Selection} from "d3";
import {ErrorMessages} from "../../constants/error";
import {splitKey} from "../../utilities/key";
import {LegendItem} from "./legend-item";

export function addLegendHoverHighlighting(legendS: LegendSelection) {
  const legend = legendS.datum()
  const chartS = legend.renderer.chartS
  if (!chartS) throw new Error(ErrorMessages.elementNotExisting)
  const drawAreaS = chartS.selectAll('.draw-area')
  return legendS.on('pointerover.chartpointhighlight pointerout.chartpointhighlight', (e) => {
    highlightElements(
      drawAreaS,
      select(e.target.closest('.legend-item')),
      e.type.endsWith('over')
    );
  });
}

function highlightElements(
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
