import {Selection, ZoomTransform} from "d3";
import {elementFromSelection, throttle} from "../../utilities/d3/util";
import {AxisDomainRV} from "../scale/axis-scaled-values-validation";
import {ScaledValuesBase} from "../scale/scaled-values-base";
import {CartesianChartValid} from "../../render";
import {getCurrentRespVal} from "../responsive-value/responsive-value";

type ZoomSelection = Selection<HTMLDivElement, Pick<CartesianChartValid, 'zoom' | 'series'>>

export function addZoom(selection: ZoomSelection, callback: (props: {
  x: ScaledValuesBase<AxisDomainRV>, y: ScaledValuesBase<AxisDomainRV>
}) => void, throttleMs = 50) {
  const {series, zoom} = selection.datum()
  const {renderer} = series
  const pWrapper = selection.selectAll('.draw-area')
  const chartE = elementFromSelection(renderer.chartSelection)
  function updateScales() {
    if (!zoom) return
    const onZoom = function (e) {
      const transform: ZoomTransform = e.transform
      const flipped = getCurrentRespVal(series.flipped, {chart: chartE})
      const x = series.x.cloneZoomed(transform, flipped ? 'y' : 'x')
      const y = series.y.cloneZoomed(transform, flipped ? 'x' : 'y')
      callback({x, y})
    }
    const throttledZoom = throttle(onZoom, throttleMs)
    pWrapper.call(
      zoom.behaviour.scaleExtent([zoom.out, zoom.in]).on('zoom.autozoom', throttledZoom)
    )
  }
  function updateRangeExtent() {
    if (!zoom) return
    selection.on('resize.autozoom', () => {
      const [x1, widthTranslate] = series.x.scale.range()
      const [y1, heightTranslate] = series.y.scale.range()
      const flipped = getCurrentRespVal(series.flipped, {chart: chartE})
      const extent: [[number, number], [number, number]] = [
        flipped ? [widthTranslate, y1] : [x1, heightTranslate], // [x1, heightTranslate], //
        flipped ? [x1, heightTranslate] : [widthTranslate, y1], //[widthTranslate, y1] //
      ];
      zoom.behaviour.extent(extent).translateExtent(extent);
    });
  }
  updateScales()
  updateRangeExtent()
}
