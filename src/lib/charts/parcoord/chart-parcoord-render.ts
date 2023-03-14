import {select, Selection} from "d3";
import {IChartParcoordData} from "./IChartParcoordData";
import {Axis, axisSequenceRender, chartBaseRender, rectFromString} from "../../core";
import {SeriesLine, seriesLineData, seriesLineRender} from "../../lines";

export type ChartParcoordSelection = Selection<SVGSVGElement | SVGGElement, IChartParcoordData>;



export function chartParcoordRender(selection: ChartParcoordSelection): void {
  selection
    .call((s) => chartBaseRender(s))
    .classed('chart-parcoord', true)
    .each((chartD, i, g) => {
      setScale(chartD, g[i])
      renderLines(chartD, g[i])
      renderAxes(chartD, g[i])
      // renderLegend(chartD)
    })
}

function calcBounds(data: IChartParcoordData, g: SVGSVGElement | SVGGElement) {
  const drawAreaS = select(g).selectAll('.draw-area');
  const drawAreaBounds = rectFromString(drawAreaS.attr('bounds') || '0, 0, 600, 400');
  const titleS = drawAreaS.select('.title')
  const titleBounds = rectFromString(!titleS.empty() ? titleS.attr('bounds') || '0, 0, 0, 0' : '0, 0, 0, 0');
  const subtitleS = drawAreaS.select('.subtitle')
  const subtitleBounds = rectFromString(!subtitleS.empty() ? subtitleS.attr('bounds') || '0, 0, 0, 0' : '0, 0, 0, 0');
  return { drawAreaBounds, titleBounds, subtitleBounds }
}

function setScale (data: IChartParcoordData, g: SVGSVGElement | SVGGElement) {
  const {drawAreaBounds, titleBounds, subtitleBounds} = calcBounds(data, g)
  const { dimensions, flipped, axisScale } = data;

  dimensions.forEach(dimension => dimension.scale.range(
    flipped ? [0, drawAreaBounds.width] : [drawAreaBounds.height - titleBounds.height - subtitleBounds.height, 0]
  )) //TODO: dynamic Padding

  axisScale.padding(0.25).range(flipped ? [drawAreaBounds.height, 0] : [0, drawAreaBounds.width]) //TODO: dynamic Padding
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
      .call((s) => axisSequenceRender(s, index))

      // .each((d, i, g) => {
      //   console.log(g[i])
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

function renderLines(data: IChartParcoordData, g: SVGSVGElement | SVGGElement) {
  const { flipped, dimensions, axisScale } = data
  const {drawAreaBounds, titleBounds, subtitleBounds} = calcBounds(data, g)
  const flippedBool = flipped ? flipped : false

  const xVals = dimensions.map((dimension, index) => index.toString())
  const yVals: number[][] = []
  const yScales = dimensions.map(dimension => dimension.scale)
  const dimensionLength = dimensions[0].values.length
  for (let vectorIndex = 0; vectorIndex <= dimensionLength; vectorIndex++) {
    const vector = dimensions.map((dimension) => {
      return dimension.values[vectorIndex]
    })
    yVals.push(vector)
  }

  const lineSeriesD: SeriesLine = seriesLineData({
    xValues: xVals,
    yValues: yVals,
    yScales,
    xScale: axisScale
  })

  const titleSpace = titleBounds.height + subtitleBounds.height
  select(g).selectAll('.draw-area').selectAll<SVGGElement, SeriesLine>('.series-line')
    .data([lineSeriesD])
    .join('g')
    .call((s) => seriesLineRender(s))
    .attr("transform", () => {
      console.log(titleSpace)
      return "translate(0, " + titleSpace + ")"
    })
    // .on('pointerover.chartlinehighlight', (e) =>
    //   chartLineHoverLine(chartS, select(e.target), true)
    // )
    // .on('pointerout.chartlinehighlight', (e) =>
    //   chartLineHoverLine(chartS, select(e.target), false)
    // );
}
