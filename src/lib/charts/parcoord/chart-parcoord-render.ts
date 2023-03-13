import {axisLeft, index, select, Selection} from "d3";
import {IChartParcoordData} from "./IChartParcoordData";
import {Axis, axisLeftRender, axisSequenceRender, chartBaseRender, rectFromString} from "../../core";

export type ChartParcoordSelection = Selection<SVGSVGElement | SVGGElement, IChartParcoordData>;



export function chartParcoordRender(selection: ChartParcoordSelection): void {
  selection
    .call((s) => chartBaseRender(s))
    .classed('chart-parcoord', true)
    .each((chartD, i, g) => {
      setScale(chartD, g[i])
      renderAxes(chartD, g[i])
      renderLines(chartD, g[i])
      // renderLegend(chartD)
    })
}

function setScale (data: IChartParcoordData, g: SVGSVGElement | SVGGElement) {
  const drawAreaS = select(g).selectAll('.draw-area');
  const drawAreaBounds = rectFromString(drawAreaS.attr('bounds') || '0, 0, 600, 400');
  const { dimensions, flipped, axisScale } = data;

  dimensions.forEach(dimension => dimension.scale.range(
    flipped ? [0, drawAreaBounds.width] : [drawAreaBounds.height, 0]
  ))

  axisScale.padding(0.25).range(flipped ? [drawAreaBounds.height, 0] : [0, drawAreaBounds.width])
}

function renderAxes(data: IChartParcoordData, g: SVGSVGElement | SVGGElement) {
  const { flipped, dimensions, axisScale } = data
  const flippedBool = flipped ? flipped : false


  dimensions.forEach((dimension, index) => { //TODO: create own render function for axes inside draw-area
    select(g).selectAll('.draw-area').selectAll<SVGGElement, Axis>(`.axis-${index}`)
      .data([null])
      .join('g')
      .data([dimension.axis])
      .join('g')
      .attr("transform", () => "translate(" + axisScale(index.toString()) + ")" )
      .each((d, i, g) => {
        console.log(g[i])
        select(g[i]).call(axisLeft(d.scale)).attr('data-ignore-layout-children', true)
        select(g[i])
          .selectAll('.title')
          .data([null])
          .join('g')
          .classed('title', true)
          .attr("y", -12)
          .attr('data-ignore-layout-children', true)
          .selectAll('text')
          .data([null])
          .join('text')
          .text(d.title)
          .style("text-anchor", "middle")
          .style("fill", "black")
      })
      // .call((s) => axisSequenceRender(s, index))
      .classed(`axis axis-${index}`, true)


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

  })
}

function renderLines(chartD: IChartParcoordData, gElement: any) {

}
