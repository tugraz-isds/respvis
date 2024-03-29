import {pathArrowsUpDownRender} from "../../../core";
import {Selection} from "d3";
import {KeyedAxisValid} from "../../../core/render/axis/keyed-axis-validation";
import {bgSVGOnlyRender} from "../../../core/render/util/bg-svg-only-render";

export function axisInverterRender(axisS: Selection<SVGGElement, KeyedAxisValid>) {
  const { series } = axisS.datum()
  const titleWrapperS = axisS.selectAll('.title-wrapper')
  const upperChevronS = pathArrowsUpDownRender(titleWrapperS, ['axis-inverter'])
  upperChevronS.selectAll('path')
    .attr('transform', 'scale(0.6)')

  const upperChevronBgS = bgSVGOnlyRender(upperChevronS)
  upperChevronBgS.on('click', () => {
    const axisIndex = series.axes.findIndex(axis => axis.key === axisS.datum().key)
    series.axesInverted[axisIndex] = !series.axesInverted[axisIndex]
    series.renderer.windowSelection.dispatch('resize')
  })

  // titleWrapperS
  //   .selectAll('.axis-inverter')
  //   .data([null])
  //   .join('g')
}
