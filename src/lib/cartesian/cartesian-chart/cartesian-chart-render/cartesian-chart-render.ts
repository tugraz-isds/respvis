import {axisLayoutRender, AxisSelection, AxisValid} from "../../../core/render/axis";
import {CartesianChartSelection} from "../cartesian-chart-validation";
import {ScaledValuesLinear} from "../../../core/data/scale/scaled-values-linear";
import {BarStackedSeries} from "../../../bar/bar-series/bar-stacked-series";
import {ScaledValues} from "../../../core/data/scale/scaled-values-base";
import {pathLine} from "../../../core/utilities/path";

export function cartesianAxisRender<T extends CartesianChartSelection>(chartS: T): void {
  const {renderer, ...data} = chartS.datum()
  const series = data.series.cloneZoomed().cloneFiltered()
  const flipped = series.responsiveState.currentlyFlipped
  const [horizontalAxisType, verticalAxisType] = flipped ? ['y', 'x'] : ['x', 'y']

  const verticalAxisD = flipped ? {...data.x, scaledValues: series.x} : {...data.y, scaledValues: series.y}
  const verticalAxisLayout = data[verticalAxisType].verticalLayout

  const horizontalAxisD = flipped ? {...data.y, scaledValues: series.y} : {...data.x, scaledValues: series.x}
  const horizontalAxisLayout = data[horizontalAxisType].horizontalLayout

  const paddingWrapperS = chartS.selectAll('.padding-wrapper')

  //TODO: clean this stacked bar chart mess up
  const aggScaledValues = series instanceof BarStackedSeries ? series.aggScaledValues.aggregateCached() : undefined

  const horizontalAxisDAgg = (aggScaledValues && horizontalAxisD.scaledValues instanceof ScaledValuesLinear) ?
    {...horizontalAxisD, scaledValues: aggScaledValues} : horizontalAxisD
  horizontalAxisDAgg.scaledValues.scale.range(horizontalAxisD.scaledValues.scale.range())

  const verticalAxisDAgg = (aggScaledValues && verticalAxisD.scaledValues instanceof ScaledValuesLinear) ?
    {...verticalAxisD, scaledValues: aggScaledValues} : verticalAxisD
  verticalAxisDAgg.scaledValues.scale.range(verticalAxisD.scaledValues.scale.range())

  paddingWrapperS.selectAll<SVGGElement, AxisSelection>(`.axis-${verticalAxisLayout}`)
    .data([verticalAxisDAgg])
    .join('g')
    .call((s) => axisLayoutRender(s, 'vertical'))
    .classed(`axis-${verticalAxisType}`, true)

  paddingWrapperS.selectAll<SVGGElement, AxisValid>(`.axis-${horizontalAxisLayout}`)
    .data([horizontalAxisDAgg])
    .join('g')
    .call((s) => axisLayoutRender(s, 'horizontal'))
    .classed(`axis-${horizontalAxisType}`, true)
}

export function originLineRender<T extends CartesianChartSelection>(chartS: T): void {
  const {horizontalAxisS, verticalAxisS, drawAreaS} = chartS.datum().series.renderer
  const gridAreaS = drawAreaS.selectAll('.grid-area')

  function needsBaseLine(values: ScaledValues) {
    if (values.tag !== 'linear') return false
    const hasNegativeVal = values.scale.domain().find(val => val < 0)
    const hasPositiveVal = values.scale.domain().find(val => val > 0)
    return hasNegativeVal && hasPositiveVal
  }

  if (needsBaseLine(horizontalAxisS.datum().scaledValues)) {
    const vals = horizontalAxisS.datum().scaledValues as ScaledValuesLinear
    const x1 = vals.scale(0)
    const x2 = x1
    const [y1, y2] = verticalAxisS.datum().scaledValues.scale.range()
    gridAreaS.selectAll('.line.line--origin.line--vertical')
      .data([null])
      .join('path')
      .call((s) => pathLine(s, [{x: x1, y: y1}, {x: x2, y: y2}]))
      .classed('line line--origin line--vertical', true)
  } else gridAreaS.selectAll('.line.line--origin.line--vertical').remove()

  if (needsBaseLine(verticalAxisS.datum().scaledValues)) {
    const vals = verticalAxisS.datum().scaledValues as ScaledValuesLinear
    const y1 = vals.scale(0)
    const y2 = y1
    const [x1, x2] = horizontalAxisS.datum().scaledValues.scale.range()
    gridAreaS.selectAll('.line.line--origin.line--horizontal')
      .data([null])
      .join('path')
      .classed('line line--origin line--horizontal', true)
      .call((s) => pathLine(s, [{x: x1, y: y1}, {x: x2, y: y2}]))
  } else gridAreaS.selectAll('.line.line--origin.line--horizontal').remove()
}
