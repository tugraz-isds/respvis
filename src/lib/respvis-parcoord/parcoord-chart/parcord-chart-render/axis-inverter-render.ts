import {bboxDiffSVG, bgSVGOnlyBBoxRender, KeyedAxisValid, pathArrowBigDown, pathArrowBigLeft} from "respvis-core";
import {Selection} from "d3";

//TODO: Refactor out duplicated code
export function axisInverterRender(axisS: Selection<SVGGElement, KeyedAxisValid>) {
  const { series } = axisS.datum()
  const flipped = series.responsiveState.currentlyFlipped
  if (flipped) axisInverterRenderVerticalChart(axisS)
  else axisInverterRenderHorizontalChart(axisS)
}

export function axisInverterRenderVerticalChart(axisS: Selection<SVGGElement, KeyedAxisValid>) {
  const { series } = axisS.datum()
  axisS.selectAll('.title-wrapper .axis-inverter').remove()
  const originalSeries = series.originalSeries
  const inverterIconS = pathArrowBigLeft(axisS, ['axis-inverter'])
  inverterIconS.selectAll('path')

  bgSVGOnlyBBoxRender(inverterIconS.selectAll('.rotation-group'), [{ scale: 1.6, offsetX: 1, offsetY: 1 }], inverterIconS.selectAll('.rotation-group'))
  const inverterIconBgS = bgSVGOnlyBBoxRender(inverterIconS, undefined, inverterIconS )
  const axisIndex = originalSeries.axes.findIndex(axis => axis.key === axisS.datum().key)

  const domainS = axisS.select<SVGPathElement>('.domain')
  const {leftCornersXDiff, leftCornersYDiff, bbox2: bboxPath} =
    bboxDiffSVG(domainS, inverterIconS.select('path'))

  const xOffset = bboxPath.width / 2
  const translateAlign = `translate(${-leftCornersXDiff - bboxPath.width - xOffset}, ${-leftCornersYDiff - bboxPath.height / 2})`
  inverterIconS.attr('transform', `${translateAlign} scale(0.8) translate(-6, 0)`)

  axisS.classed('axis-inverted', originalSeries.axesInverted[axisIndex])
  inverterIconBgS
    .classed('cursor cursor--invert-horizontal', true)
    .classed('cursor--invert-right', originalSeries.axesInverted[axisIndex])
    .on('click', function() {
    const axisIndex = originalSeries.axes.findIndex(axis => axis.key === axisS.datum().key)
    originalSeries.axesInverted[axisIndex] = !originalSeries.axesInverted[axisIndex]
    axisS.classed('axis-inverted', originalSeries.axesInverted[axisIndex])
    inverterIconBgS.classed('cursor--invert-right', originalSeries.axesInverted[axisIndex])
    originalSeries.renderer.windowS.dispatch('resize')
    setTimeout(() => {
      originalSeries.renderer.windowS.dispatch('resize')
    }, 500)
  })
}

export function axisInverterRenderHorizontalChart(axisS: Selection<SVGGElement, KeyedAxisValid>) {
  const { series } = axisS.datum()
  axisS.selectChildren('.axis-inverter').remove()
  const originalSeries = series.originalSeries
  const titleWrapperS = axisS.selectAll('.title-wrapper')
  const inverterIconS = pathArrowBigDown(titleWrapperS, ['axis-inverter'])

  inverterIconS.selectAll('path').attr('transform', 'scale(0.8) translate(-3, -3)')

  bgSVGOnlyBBoxRender(inverterIconS.selectAll('.rotation-group'), [{ scale: 1.6, offsetX: 1, offsetY: 1 }], inverterIconS.selectAll('.rotation-group'))
  const inverterIconBgS = bgSVGOnlyBBoxRender(inverterIconS, undefined, inverterIconS )
  const axisIndex = originalSeries.axes.findIndex(axis => axis.key === axisS.datum().key)

  axisS.classed('axis-inverted', originalSeries.axesInverted[axisIndex])
  inverterIconBgS
    .classed('cursor cursor--invert-vertical', true)
    .classed('cursor--invert-up', originalSeries.axesInverted[axisIndex])
    .on('click', function() {
    const axisIndex = originalSeries.axes.findIndex(axis => axis.key === axisS.datum().key)
    originalSeries.axesInverted[axisIndex] = !originalSeries.axesInverted[axisIndex]
      axisS.classed('axis-inverted', originalSeries.axesInverted[axisIndex])
      inverterIconBgS.classed('cursor--invert-up', originalSeries.axesInverted[axisIndex])
      originalSeries.renderer.windowS.dispatch('resize')
    setTimeout(() => {
      originalSeries.renderer.windowS.dispatch('resize')
    }, 500)
  })
}
