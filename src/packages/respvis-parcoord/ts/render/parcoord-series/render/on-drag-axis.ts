import {D3ZoomEvent, Selection} from "d3";
import {relateDragWayToSelection, RVArray} from "respvis-core";
import {KeyedAxis} from "../../validate-keyed-axis";

export function onDragAxisParcoord(e: D3ZoomEvent<any, any>, d: KeyedAxis, drawAreaBackgroundS: Selection<SVGRectElement>) {
  const dragWay = relateDragWayToSelection(e, drawAreaBackgroundS)
  if (!dragWay) return
  const originalData = d.series.originalData
  const percentageDomain = originalData.axesPercentageScale.domain()
  const axisIndex = percentageDomain.indexOf(d.key)
  const percentageRange = originalData.axesPercentageScale.range()

  const oldPercentage = percentageRange[axisIndex]
  const newPercentage = d.series.responsiveState.currentlyFlipped ? 1 - dragWay.fromTopPercent : dragWay.fromLeftPercent
  rearrangeAxesWithEqualPercentage()

  percentageRange[axisIndex] = newPercentage
  originalData.axesPercentageScale.range(percentageRange)

  function rearrangeAxesWithEqualPercentage() {
    percentageRange.forEach((currP, currPI) => {
      if (!(currP === newPercentage && currPI !== axisIndex)) return
      percentageRange[currPI] = currP + (oldPercentage > newPercentage ? 0.01 : -0.01)
    })
  }
}

export function onDragEndAxisParcoord(d: KeyedAxis) {
  const {renderer, originalData} = d.series
  const {axesPercentageScale } = originalData

  const equidistantAxesActive = renderer.windowS.datum().windowSettings.get('parcoordEquidistantAxes')
  if (!equidistantAxesActive) return
  const percentageRange = axesPercentageScale.range()
  const order = RVArray.mapToRanks(percentageRange)

  const newPercentageRange = order.map((eOrder) => (eOrder - 1) / (order.length - 1))
  axesPercentageScale.range(newPercentageRange)
  renderer.windowS.dispatch('resize')
}


