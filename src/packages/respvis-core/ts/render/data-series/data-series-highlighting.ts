import {select, Selection} from "d3";
import {DataSeries} from "./data-series";

export function addSeriesHighlighting(seriesS: Selection<any, DataSeries>) {
  return seriesS.on('pointerover.seriespointhighlight pointerout.seriespointhighlight', (e: PointerEvent) => {
      const target = (<Element>e.target)
      const key = select(target).attr('data-key')
      const equalDataS = select(target.closest('.chart')).selectAll(`[data-key='${key}']`)

      const toggleVal = e.type.endsWith('over')
      equalDataS.classed('highlight', toggleVal)
    }
  )
}
