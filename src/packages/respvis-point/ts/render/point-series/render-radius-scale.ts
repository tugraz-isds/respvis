import {PointSeries} from "respvis-point";
import {Axis, LegendSelection, rectFromString, renderAxisLayout} from "respvis-core";
import {RespValInterpolated} from "respvis-core/data/responsive-value/responsive-value-interpolated";
import {cssVarDefaultsKeys} from "respvis-core/constants/cssVars";

export function renderRadiusScale(legendS: LegendSelection, series: PointSeries) {
  const {radii} = series as PointSeries
  if (typeof radii === 'number' || radii instanceof RespValInterpolated) return

  const [minRadius, maxRadius] = radii.scale.range()

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
