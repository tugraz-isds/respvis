import {Selection} from "d3";
import {KeyedAxis} from "../../validate-keyed-axis";
import {RVArray} from "respvis-core";

export function updateAxisCursorClasses(axisS: Selection<SVGGElement, KeyedAxis>) {
  const {responsiveState, originalData} = axisS.datum().series
  const {axes, axesPercentageScale} = originalData

  const flipped = responsiveState.currentlyFlipped
  const axisIndex = axes.findIndex(axis => axis.key === axisS.datum().key)
  const percentageRange = axesPercentageScale.range()
  const orderArray = RVArray.mapToRanks(percentageRange)
  const titleWrapperS = axisS.selectAll('.title-wrapper')
  titleWrapperS.classed('cursor', true)
    .classed('cursor--drag-horizontal', !flipped)
    .classed('cursor--drag-right-only', !flipped && orderArray[axisIndex] === 1)
    .classed('cursor--drag-left-only', !flipped && orderArray[axisIndex] === orderArray.length)
    .classed('cursor--drag-vertical', flipped)
    .classed('cursor--drag-up-only', flipped && orderArray[axisIndex] === 1)
    .classed('cursor--drag-down-only', flipped && orderArray[axisIndex] === orderArray.length)
}
