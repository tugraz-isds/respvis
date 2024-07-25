import {range, select, Selection} from "d3";
import {SVGHTMLElement, SVGHTMLElementLegacy} from "../../constants/types";
import {Legend} from "./validate-legend";
import {renderLegendCategories} from "./legend-item/render-legend-categories";
import {uniqueId} from "../../utilities";
import {Axis, renderAxisLayout} from "../axis";
import {rectFromString} from "../../data";

export type LegendSelection = Selection<SVGHTMLElement, Legend>

export function renderLegend(parentS: Selection, legend: Legend): LegendSelection {
  const legendS = parentS
    .selectAll<SVGGElement, Legend>('.legend')
    .data([legend])
    .join('g')
    .classed('legend', true)
    .each((legendD, i, g) => {
      const legendS = select<SVGHTMLElementLegacy, Legend>(g[i])
      renderLegendCategories(legendS)
      renderLegendColorScale(legendS)
    })

  return legendS
}

function renderLegendColorScale(legendS: LegendSelection) {
  const {series, renderer} = legendS.datum()
  const {color} = series.originalData
  if (!color) return

  const defsS = renderer.chartS.selectAll('defs')
    .data([null])
    .join('defs')

  const colorScaleGradientS = defsS.selectAll('.color-scale-gradient')
    .data([color])
    .join('linearGradient')
    .classed('color-scale-gradient', true)
  if (!colorScaleGradientS.attr('id')) colorScaleGradientS.attr('id', `color-scale-gradient-${uniqueId()}`)

  const [domainMin, domainMax] = [Math.min(...color.scale.domain()), Math.max(...color.scale.domain())]
  const domainDiff = domainMax - domainMin

  // Set the color stops for the gradient
  if (colorScaleGradientS.selectAll("stop").empty()) {
    colorScaleGradientS.selectAll("stop")
      .data(range(0, 1.05, 0.05))
      .join("stop")
      .attr("offset", d => d)
      .attr("stop-color", d => color?.scale(domainMin + d * domainDiff) ?? null);
  }

  // Draw the gradient rectangle
  const legendColorScaleS = legendS.selectAll(".legend__color-scale")
    .data([null])
    .join('g')
    .classed('legend__color-scale', true)

  const legendColorScaleRectS = legendColorScaleS.selectAll('rect')
    .data([null]).join('rect')
    .style("fill", `url(#${colorScaleGradientS.attr('id')})`)

  const {width, height} = rectFromString(legendColorScaleS.attr('bounds') || '0, 0, 600, 400')
  color.axis.scaledValues.scale.range([0, width])
  const legendColorScaleAxisS = legendColorScaleS.selectAll<SVGGElement, Axis>('.axis')
    .data([color.axis])
    .join('g')
    .call((s) => renderAxisLayout(s, 'horizontal'))
    .classed('axis', true)
}
