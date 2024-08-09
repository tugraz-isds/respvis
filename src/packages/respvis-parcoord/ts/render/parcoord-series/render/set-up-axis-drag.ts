import {drag, Selection} from "d3";
import {KeyedAxis} from "../../validate-keyed-axis";
import {hasDrag, throttle} from "respvis-core";
import {onDragAxisParcoord, onDragEndAxisParcoord} from "./on-drag-axis";

export function setUpAxisDrag(axisS: Selection<SVGGElement, KeyedAxis>, i: number) {
  const axisD = axisS.datum()

  if (!hasDrag(axisS.selectAll('.title-wrapper'))) {
    applyDragListeners()
  }

  function applyDragListeners() {
    const throttledDrag = throttle((e) => onDragAxisParcoord(e, axisD, axisD.renderer.drawAreaBgS), 30)
    const onDrag = (e) => {
      if (e.sourceEvent.type === "mousemove") {
        // console.log('MOUSEMOVEEVENT!', e)
        throttledDrag.func(e)
        axisD.series.renderer.windowS.dispatch('resize')
      } else if (e.sourceEvent.type === "touchmove") {
        // console.log('TOUCHMOVEEVENT!', e)
        throttledDrag.func(e)
        axisD.series.renderer.windowS.dispatch('resize')
      }
    }
    axisS.selectAll('.title-wrapper').call(drag().on("drag.dragAxis", onDrag)
      .on("end.dragAxis", () => onDragEndAxisParcoord(axisD))
    )
  }
}
