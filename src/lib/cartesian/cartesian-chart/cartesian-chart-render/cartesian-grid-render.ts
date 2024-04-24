import {CartesianChartSelection} from "../cartesian-chart-validation";
import {pathLine} from "../../../core";
import {select} from "d3";


export function cartesianGridRender<T extends CartesianChartSelection>(chartS: T) {
  const {series} = chartS.datum()
  const {drawAreaS} = series.renderer
  const horizontalAxisS = series.renderer.horizontalAxisS
  const verticalAxisS = series.renderer.verticalAxisS
  const drawAreaE = series.renderer.drawAreaBgS.node() as SVGGElement
  if (!drawAreaE) return
  const drawAreaPos = drawAreaE.getBoundingClientRect()

  cartesianGridHorizontalLinesRender()
  cartesianGridVerticalLinesRender()

  function cartesianGridHorizontalLinesRender() {
    const gridLineFactor = verticalAxisS.datum().gridLineFactor
    const ticks = verticalAxisS.selectAll<SVGLineElement, any>(".tick line").filter(function () {
      return this.checkVisibility()
    })

    const tickPositions: number[] = []
    ticks.each(function() {
      const tickPos = this.getBoundingClientRect()
      tickPositions.splice(0, 0, tickPos.y + tickPos.height / 2 - drawAreaPos.y)
    })
    tickPositions.splice(0, 0, 0)

    let linePositions: number[] = []
    if (gridLineFactor !== undefined) {
      linePositions = linePositionsFromTickPositions(tickPositions, gridLineFactor)
      linePositions.splice(0, 0, 0)
      linePositions.pop()
    }

    const [x1, x2] = horizontalAxisS.datum().scaledValues.scale.range()
    drawAreaS.selectAll('.line.line--grid.line--horizontal')
      .data(linePositions)
      .join('path')
      .each((d, i, g) => pathLine(select(g[i]), [
        {x: x1, y: d}, {x: x2, y: d}]))
      .classed('line line--grid line--horizontal', true)
  }

  function cartesianGridVerticalLinesRender() {
    const gridLineFactor = horizontalAxisS.datum().gridLineFactor
    if (!gridLineFactor) return
    const ticks = horizontalAxisS.selectAll<SVGLineElement, any>(".tick line").filter(function () {
      return this.checkVisibility()
    })

    const tickPositions: number[] = [0]
    ticks.each(function() {
      const tickPos = this.getBoundingClientRect()
      tickPositions.push(tickPos.x + tickPos.width / 2 - drawAreaPos.x)
    })

    let linePositions: number[] = []
    if (gridLineFactor !== undefined) {
      linePositions = linePositionsFromTickPositions(tickPositions, gridLineFactor)
      linePositions.push(drawAreaPos.width)
    }

    const [y1, y2] = verticalAxisS.datum().scaledValues.scale.range()
    drawAreaS.selectAll('.line.line--grid.line--vertical')
      .data(linePositions)
      .join('path')
      .each((d, i, g) => pathLine(select(g[i]), [
        {x: d, y: y1}, {x: d, y: y2}]))
      .classed('line line--grid line--vertical', true)
  }

}




function linePositionsFromTickPositions(tickPositions: number[], gridLineFactor: number) {
  const linePositions: number[] = []
  const maxPosition = Math.max(...tickPositions)
  if (gridLineFactor < 1) factorSmaller1()
  if (gridLineFactor > 1) factorGreater1()
  if (gridLineFactor === 1) factorEquals1()

  function factorSmaller1() {
    linePositions.push(tickPositions[0])
    for(let i = 0; i < tickPositions.length - 1; i++) {
      const lastPosition = linePositions[linePositions.length - 1]
      while (tickPositions[i] < lastPosition && i < tickPositions.length) i++
      linePositions.push(...splitDistance(gridLineFactor, tickPositions[i], tickPositions[i + 1]))
    }
    linePositions.shift()
  }

  function factorGreater1() {
    const distances = tickPositions.slice(0, tickPositions.length - 1)
      .map((pos, index) => Math.abs(tickPositions[index + 1] - pos))
    const maxDistanceIndex = distances
      .reduce((pIndex, _, cIndex) => distances[pIndex] > distances[cIndex] ? pIndex : cIndex, 0)
    const maxDistance = distances[maxDistanceIndex]
    let lastPosition = tickPositions[maxDistanceIndex] % maxDistance
    do {
      linePositions.push(lastPosition)
      lastPosition = lastPosition + maxDistance * gridLineFactor
    } while (lastPosition < maxPosition)
  }

  function factorEquals1() {
    linePositions.push(tickPositions[0])
    for(let i = 0; i < tickPositions.length - 1; i++) {
      const lastPosition = linePositions[linePositions.length - 1]
      linePositions.push( lastPosition + Math.abs(tickPositions[i + 1] - tickPositions[i]) * gridLineFactor)
    }
    linePositions.shift()
  }

  return linePositions
}

function splitDistance(gridLineFactor: number, position1: number, position2: number) {
  const positions: number[] = []
  const distance = Math.abs(position1 - position2)
  let position = position1
  do {
    positions.push(position)
    position += gridLineFactor * distance
  } while (position < position2)
  return positions
}
