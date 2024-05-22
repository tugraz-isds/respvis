import {bboxDiffSVG, KeyedAxis, pathArrowBigDown, pathArrowBigLeft, renderBgSVGOnlyBBox} from "respvis-core";
import {Selection} from "d3";

export function renderAxisInverter(axisS: Selection<SVGGElement, KeyedAxis>) {
  const { series } = axisS.datum()
  const flipped = series.responsiveState.currentlyFlipped
  if (flipped) renderAxisInverterVerticalChart(axisS)
  else renderAxisInverterHorizontalChart(axisS)
}

export function renderAxisInverterVerticalChart(axisS: Selection<SVGGElement, KeyedAxis>) {
  const { series } = axisS.datum()
  axisS.selectAll('.title-wrapper .axis-inverter').remove()
  const originalSeries = series.originalSeries
  const inverterIconS = pathArrowBigLeft(axisS, ['axis-inverter'])
  inverterIconS.selectAll('path')

  renderBgSVGOnlyBBox(inverterIconS.selectAll('.rotation-group'), [{ scale: 1.6, offsetX: 1, offsetY: 1 }], inverterIconS.selectAll('.rotation-group'))
  const inverterIconBgS = renderBgSVGOnlyBBox(inverterIconS, undefined, inverterIconS )
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

export function renderAxisInverterHorizontalChart(axisS: Selection<SVGGElement, KeyedAxis>) {
  const { series } = axisS.datum()
  axisS.selectChildren('.axis-inverter').remove()
  const originalSeries = series.originalSeries
  const titleWrapperS = axisS.selectAll('.title-wrapper')
  const inverterIconS = pathArrowBigDown(titleWrapperS, ['axis-inverter'])

  inverterIconS.selectAll('path').attr('transform', 'scale(0.8) translate(-3, -3)')

  renderBgSVGOnlyBBox(inverterIconS.selectAll('.rotation-group'), [{ scale: 1.6, offsetX: 1, offsetY: 1 }], inverterIconS.selectAll('.rotation-group'))
  const inverterIconBgS = renderBgSVGOnlyBBox(inverterIconS, undefined, inverterIconS )
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
