import {Selection} from "d3";
import {Series} from "./series";

export function addHighlight(seriesS: Selection<any, Series>) {
  return seriesS.on('pointerover.seriespointhighlight pointerout.seriespointhighlight', (e: PointerEvent) =>
    (<Element>e.target).classList.toggle('highlight', e.type.endsWith('over'))
  )
}
