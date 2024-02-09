import {axisSequenceRender, AxisValid, chartRender} from "../../core";
import {select, Selection} from "d3";
import {ParcoordChartValid} from "./parcoord-chart-validation";
import {Line, lineSeriesJoin} from "../../line";
import {combineKeys} from "../../core/utilities/dom/key";
import {defaultStyleClass} from "../../core/constants/other";

export type ParcoordChartSVGChartSelection = Selection<SVGSVGElement | SVGGElement, ParcoordChartValid>;

export function parCoordChartRender(selection: ParcoordChartSVGChartSelection) {
  // const { legend } = selection.datum()
  chartRender(selection).chartS
    .classed('chart-parcoord', true)
    .call(renderLineSeries)
    .call(renderAxisSeries)
  // const legendS = legendRender(selection, legend)
  // legendAddHover(legendS)
  // selection.call(chartCartesianAxisRender)
}


function renderAxisSeries(chartS: Selection<Element, ParcoordChartValid>) {
  const { series} = chartS.datum()

  const axisSeriesS = chartS.selectAll('.draw-area')
    .selectAll<SVGGElement, AxisValid>(`.series-parcoord-axes`)
    .data([series])
    .join('g')
    .classed(`series-parcoord-axes`, true)

  const boundsAttr = axisSeriesS.attr('bounds')
  if (!boundsAttr) return

  axisSeriesS
    .selectAll<SVGGElement, AxisValid>('.axis.axis-sequence')
    .data(series.axes)
    .join('g')
    .each((d, i, g) => axisSequenceRender(select(g[i])))
    .attr('transform', (d, i) => {
      const x = series.axesScale(series.axisKeys[i]) ?? 0
      return `translate(${x}, ${0})`
    })
}

function renderLineSeries(chartS: Selection<Element, ParcoordChartValid>) {
  const { series} = chartS.datum()

  const lineSeriesS = chartS.selectAll('.draw-area')
    .selectAll<SVGGElement, AxisValid>(`.series-parcoord-lines`)
    .data([series])
    .join('g')
    .classed(`series-parcoord-lines`, true)
  .attr('data-ignore-layout-children', true)

  if (!lineSeriesS.attr('bounds') || !series.axes[0]) return

  const lines: Line[] = series.axes[0].scaledValues.values.map((_, valueIndex) => {
    return {
      key: combineKeys([series.key, `i-${valueIndex}`]), //TODO
      styleClass: series.categories ? series.categories.categories.styleClassValues[valueIndex] : defaultStyleClass,
      positions: series.axes.map((axis, axisIndex) => {
        return {
          y: axis.scaledValues.getScaledValue(valueIndex),
          x: series.axesScale(series.axisKeys[axisIndex])!
        }
      })
    }
  })

  lineSeriesS.selectAll<SVGPathElement, Line>('path')
    .data(lines, (d) => d.key)
    .call(s => lineSeriesJoin(lineSeriesS, s))
}
