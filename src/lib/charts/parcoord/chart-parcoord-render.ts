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
  const { axes, scales, dimensions, styleClasses, title, subtitle, flipped, axisScale } = data;


  scales?.forEach(scale => scale.range(
    flipped ? [0, drawAreaBounds.width] : [drawAreaBounds.height, 0]
  ))

  axisScale.padding(0.25).range(flipped ? [drawAreaBounds.height, 0] : [0, drawAreaBounds.width])
}

function renderAxes(data: IChartParcoordData, g: SVGSVGElement | SVGGElement) {
  const { flipped, axes, axisScale } = data
  const flippedBool = flipped ? flipped : false


  axes.forEach((axis, index) => {
    select(g).selectAll<SVGGElement, Axis>(`.axis-${index}`)
      .data([null])
      .join('g')
      .data([axis])
      .join('g')
      .attr("transform", () => "translate(" + axisScale(index.toString()) + ")" )
      .call((s) => axisSequenceRender(s, index))
      .classed(`axis-${index}`, true)
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
