import {axisSequenceRender, AxisValid, chartBaseRender} from "../../core";
import {select, Selection} from "d3";
import {ParcoordChartValid} from "./parcoord-chart-validation";

export type ParcoordChartSVGChartSelection = Selection<SVGSVGElement | SVGGElement, ParcoordChartValid>;

export function parCoordChartRender(selection: ParcoordChartSVGChartSelection) {
  // const { legend } = selection.datum()
  chartBaseRender(selection).chart
    .classed('chart-parcoord', true)
    .call(renderAxisSeries)
  // const legendS = legendRender(selection, legend)
  // legendAddHover(legendS)
  // selection.call(chartCartesianAxisRender)
}


function renderAxisSeries(chartS: Selection<Element, ParcoordChartValid>) {
  const { series} = chartS.datum()

  const axisSeriesS = chartS.selectAll('.draw-area')
    .selectAll<SVGGElement, AxisValid>(`.series-parcoord-axis`)
    .data([series])
    .join('g')
    .classed(`series-parcoord-axis`, true)
    .attr('data-ignore-layout-children', true)

  const boundsAttr = axisSeriesS.attr('bounds')
  if (!boundsAttr) return
  // axisSeriesS.datum().bounds = rectFromString(boundsAttr)

  const axisS = axisSeriesS
    .selectAll<SVGGElement, AxisValid>('.axis.axis-sequence')
    .data(series.axes)
    .join('g')
    .each((d, i, g) => axisSequenceRender(select(g[i])))
    .attr('transform', (d, i) => {
      const x = series.axesScale(series.axisKeys[i]) ?? 0
      return `translate(${x}, ${0})`
    })


  // dimensions.forEach((dimension, index) => { //TODO: create own render function for axes inside draw-area
  //   select(g).selectAll('.draw-area').selectAll<SVGGElement, AxisValid>(`.axis-${index}`)
  //     .data([null])
  //     .join('g')
  //     .data([dimension.axis])
  //     .join('g')
  //     .attr("transform", () => "translate(" + axisScale(index.toString()) + ")" )
  //     .call((s) => axisSequenceRender(s, index))

      // .each((d, i, g) => {
      //   select(g[i]).call(axisLeft(d.scale)).attr('data-ignore-layout-children', true)
      //   select(g[i])
      //     .selectAll('.title')
      //     .data([null])
      //     .join('g')
      //     .classed('title', true)
      //     .attr("y", -12)
      //     .attr('data-ignore-layout-children', true)
      //     .selectAll('text')
      //     .data([null])
      //     .join('text')
      //     .text(d.title)
      //     .style("text-anchor", "middle")
      //     .style("fill", "black")
      // })
      // .classed(`axis axis-${index}`, true)


    // .each(function(d) { select(this).call(axisLeft(d.scale)); })

    // // And I build the axis with the call function
    // .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
    // // Add axis title
    // .append("text")
    // .style("text-anchor", "middle")
    // .attr("y", -9)
    // .text(function(d) { return d; })
    // .style("fill", "black")
    //
    // .call((s) => axisLeftRender(s))
    // .classed(`.axis-${index}`, flippedBool)
}
