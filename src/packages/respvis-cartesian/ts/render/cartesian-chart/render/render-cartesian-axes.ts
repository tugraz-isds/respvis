import {CartesianChartSelection} from "../validate-cartesian-chart";
import {CartesianAxis} from "../../validate-cartesian-axis";
import {
  Axis,
  AxisSelection,
  renderAxisLayout,
  ScaledValuesCumulativeAggregator,
  ScaledValuesNumeric
} from "respvis-core";

export function renderCartesianAxes<T extends CartesianChartSelection>(chartS: T) {
  const {renderer, ...data} = chartS.datum()
  const series = data.series.cloneZoomed().cloneFiltered()
  const flipped = series.responsiveState.currentlyFlipped
  const [horizontalAxisType, verticalAxisType] = flipped ? ['y', 'x'] : ['x', 'y']

  const verticalAxisD: CartesianAxis = {...data[verticalAxisType], scaledValues: series[verticalAxisType]}
  const horizontalAxisD: CartesianAxis = {...data[horizontalAxisType], scaledValues: series[horizontalAxisType]}
  const paddingWrapperS = chartS.selectAll('.padding-wrapper')

  //TODO: clean this stacked bar chart mess up
  const aggScaledValues = ('aggScaledValues' in series && series.aggScaledValues instanceof ScaledValuesCumulativeAggregator) ?
    series.aggScaledValues.aggregateCached() : undefined

  const horizontalAxisDAgg = (aggScaledValues && horizontalAxisD.scaledValues instanceof ScaledValuesNumeric) ?
    {...horizontalAxisD, scaledValues: aggScaledValues} : horizontalAxisD
  horizontalAxisDAgg.scaledValues.scale.range(horizontalAxisD.scaledValues.scale.range())

  const verticalAxisDAgg = (aggScaledValues && verticalAxisD.scaledValues instanceof ScaledValuesNumeric) ?
    {...verticalAxisD, scaledValues: aggScaledValues} : verticalAxisD
  verticalAxisDAgg.scaledValues.scale.range(verticalAxisD.scaledValues.scale.range())

  paddingWrapperS.selectAll<SVGGElement, AxisSelection>(`.axis-${verticalAxisType}`)
    .data([verticalAxisDAgg])
    .join('g')
    .call((s) => renderAxisLayout(s, 'vertical'))
    .classed(`axis-${verticalAxisType}`, true)

  paddingWrapperS.selectAll<SVGGElement, Axis>(`.axis-${horizontalAxisType}`)
    .data([horizontalAxisDAgg])
    .join('g')
    .call((s) => renderAxisLayout(s, 'horizontal'))
    .classed(`axis-${horizontalAxisType}`, true)
}
