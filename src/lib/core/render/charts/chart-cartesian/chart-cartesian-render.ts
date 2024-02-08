import {Selection} from "d3";
import {axisBottomRender, axisLeftRender, AxisSelection, AxisValid} from "../../axis";
import {ChartCartesianSelection} from "./chart-cartesian-validation";
import {getCurrentRespVal} from "../../../data/responsive-value/responsive-value";
import {elementFromSelection} from "../../../utilities/d3/util";
import {ScaledValuesAggregation} from "../../../data/scale/scaled-values-aggregation";
import {ScaledValuesLinear} from "../../../data/scale/scaled-values-linear";
import {BarSeries} from "../../../../bar";

export function chartCartesianAxisRender<T extends ChartCartesianSelection>(chartS: T): void {
  const {renderer, ...data} = chartS.datum()
  const flipped = getCurrentRespVal(data.series.flipped, {chart: elementFromSelection(chartS)})
  const leftAxisD = flipped ? data.x : data.y
  const leftAxisClass = flipped ? 'axis-x' : 'axis-y'
  const bottomAxisD = flipped ? data.y : data.x
  const bottomAxisClass = flipped ? 'axis-y' : 'axis-x'
  const paddingWrapperS = chartS.selectAll('.padding-wrapper')

  chartS.classed('chart-cartesian', true)
    .attr('data-flipped', flipped)

  //TODO: clean this stacked bar chart mess up
  const aggScaledValues = new ScaledValuesAggregation(
    leftAxisD.scaledValues, bottomAxisD.scaledValues, data.series.categories).aggregateIfPossible()

  const bottomAxisDAgg = (aggScaledValues && bottomAxisD.scaledValues instanceof ScaledValuesLinear &&
    data.series instanceof BarSeries && data.series.type === 'stacked') ?
    {...bottomAxisD, scaledValues: aggScaledValues} : bottomAxisD
  bottomAxisDAgg.scaledValues.scale.range(bottomAxisD.scaledValues.scale.range())

  const leftAxisDAgg = (aggScaledValues && leftAxisD.scaledValues instanceof ScaledValuesLinear &&
    data.series instanceof BarSeries && data.series.type === 'stacked') ?
    {...leftAxisD, scaledValues: aggScaledValues} : leftAxisD
  leftAxisDAgg.scaledValues.scale.range(leftAxisD.scaledValues.scale.range())

  const leftAxisS= paddingWrapperS.selectAll<SVGGElement, AxisSelection>('.axis-left')
    .data([leftAxisDAgg])
    .join('g')
    .call((s) => axisLeftRender(s))
    .classed(leftAxisClass, true)
    .classed(bottomAxisClass, false)

  const bottomAxisS = paddingWrapperS.selectAll<SVGGElement, AxisValid>('.axis-bottom')
    .data([bottomAxisDAgg])
    .join('g')
    .call((s) => axisBottomRender(s))
    .classed(bottomAxisClass, true)
    .classed(leftAxisClass, false)

  renderer.yAxisSelection = flipped ? bottomAxisS: leftAxisS
  renderer.xAxisSelection = flipped ? leftAxisS : bottomAxisS
}

export enum LegendPosition {
  Top = 'top',
  Right = 'right',
  Bottom = 'bottom',
  Left = 'left',
}

export function chartLegendPosition(
  chartSelection: Selection<SVGSVGElement | SVGGElement>,
  position: LegendPosition
): void {
  chartSelection.attr('data-legend-position', position);
}
