import {createSelectionClasses, renderBgSVGOnlyBBox, renderSVGSeries} from "respvis-core";
import {Selection} from "d3";
import {KeyedAxis} from "../../validate-keyed-axis";
import ArrowUpNarrowSVG from "../../../../../../assets/svg/tablericons/arrow-up-narrow.svg"

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
  const inverterIconS = renderSVGArrowNarrowUp(axisS, ['axis-inverter', 'axis-inverter-horizontal'])
    .classed('layout-container', true)

  const inverterIconBgS = renderBgSVGOnlyBBox(inverterIconS, [{ scale: 1.6 }], inverterIconS)
  const axisIndex = originalSeries.axes.findIndex(axis => axis.key === axisS.datum().key)

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
  const subtitleS = titleWrapperS.selectAll('.subtitle')
  const inverterIconParentS = subtitleS.empty() ? titleWrapperS : subtitleS
  const inverterIconS = renderSVGArrowNarrowUp(inverterIconParentS, ['axis-inverter'])
  const inverterIconBgS = renderBgSVGOnlyBBox(inverterIconS, [{ scale: 1.6 }], inverterIconS)

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

function renderSVGArrowNarrowUp(selection: Selection, classes: string[]) {
  const {selector, classString} = createSelectionClasses(classes)
  let rotationGroup = selection.selectAll<SVGGElement, any>('.svg-wrapper' + selector)
  const svgGroup = rotationGroup.selectAll('svg')
  if (rotationGroup.empty() || svgGroup.empty()) {
    rotationGroup = rotationGroup.data([null])
      .join('g')
      .classed('svg-wrapper', true)
      .classed(classString, true)
    renderSVGSeries(rotationGroup, [ArrowUpNarrowSVG])
    rotationGroup.selectAll('svg')
      .attr('data-ignore-layout-children', true)
    return rotationGroup
  }
  return rotationGroup
}
