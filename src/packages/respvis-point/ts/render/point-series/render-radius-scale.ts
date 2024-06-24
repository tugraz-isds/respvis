import {PointSeries} from "respvis-point";
import {Axis, LegendSelection, rectFromString, renderAxisLayout} from "respvis-core";
import {RespValInterpolated} from "respvis-core/data/responsive-value/responsive-value-interpolated";
import {cssVarDefaultsKeys} from "respvis-core/constants/cssVars";

export function renderRadiusScale(legendS: LegendSelection, series: PointSeries) {
  const {radii} = series as PointSeries
  if (typeof radii === 'number' || radii instanceof RespValInterpolated) return

  const {minIndex, maxIndex, min, max} = radii.axis.scaledValues.values.reduce((acc, current, currentIndex) => {
    if (!radii.axis.scaledValues.isValueActive(currentIndex)) return acc
    return {
      ...((acc.minIndex === -1 || current < acc.min) ? {min: current, minIndex: currentIndex} : acc),
      ...((acc.maxIndex === -1 || current > acc.max) ? {max: current, maxIndex: currentIndex} : acc)
    }
  }, {minIndex: -1, maxIndex: -1, min: -1, max: -1})

  const minRadius = radii.scale(min)
  const maxRadius = radii.scale(max)

  legendS.style(cssVarDefaultsKeys["--min-radius"], `${minRadius}px`)
    .style(cssVarDefaultsKeys["--max-radius"], `${maxRadius}px`)

  const legendRadiusScaleS = legendS.selectAll(".legend__radius-scale")
    .data([null])
    .join('g')
    .classed('legend__radius-scale', true)

  const legendRadiusScalePointS = legendRadiusScaleS
    .selectAll('.elements')
    .data([null])
    .join('g')
    .classed('elements', true)
    .selectAll('.element.point')
    .data([minRadius, maxRadius])
    .join('circle')
    .classed('element', true)
    .classed('point', true)
    .attr('r', d => d)

  const {width, height} = rectFromString(legendRadiusScaleS.attr('bounds') || '0, 0, 600, 400')
  radii.axis.scaledValues.scale.range([0, width])
  const legendColorScaleAxisS = legendRadiusScaleS.selectAll<SVGGElement, Axis>('.axis')
    .data([radii.axis])
    .join('g')
    .call((s) => renderAxisLayout(s, 'horizontal'))
    .classed('axis', true)
}
