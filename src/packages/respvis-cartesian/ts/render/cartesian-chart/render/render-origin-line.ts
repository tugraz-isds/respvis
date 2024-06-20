import {pathLine, ScaledValuesLinear, ScaledValuesSpatial} from "respvis-core";
import {CartesianChartSelection} from "../validate-cartesian-chart";

export function renderOriginLine<T extends CartesianChartSelection>(chartS: T): void {
  const {horizontalAxisS, verticalAxisS, drawAreaS} = chartS.datum().series.renderer
  const gridAreaS = drawAreaS.selectAll('.grid-area')

  function needsBaseLine(values: ScaledValuesSpatial) {
    if (values.tag !== 'linear') return false
    const hasNegativeVal = values.values.find(val => val < 0)
    const hasPositiveVal = values.values.find(val => val > 0)
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
