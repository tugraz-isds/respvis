import {Selection, ZoomTransform} from "d3";
import {throttle} from "../../utilities/d3/util";
import {AxisDomainRV} from "../scale/axis-scaled-values-validation";
import {ScaledValuesBase} from "../scale/scaled-values-base";
import {CartesianChartValid} from "../../render";

type ZoomSelection = Selection<HTMLDivElement, Pick<CartesianChartValid, 'zoom' | 'series'>>

export function addZoom(selection: ZoomSelection, callback: (props: {
  x: ScaledValuesBase<AxisDomainRV>, y: ScaledValuesBase<AxisDomainRV>
}) => void, throttleMs = 50) {
  const {series, zoom} = selection.datum()
  const pWrapper = selection.selectAll('.padding-wrapper')
  function updateScales() {
    if (!zoom) return
    const onZoom = function (e) {
      const transform: ZoomTransform = e.transform
      const x = series.x.cloneZoomed(transform, 'x')
      const y = series.y.cloneZoomed(transform, 'y')
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
      const extent: [[number, number], [number, number]] = [
        [x1, heightTranslate],
        [widthTranslate, y1],
      ];
      zoom.behaviour.extent(extent).translateExtent(extent);
    });
  }
  updateScales()
  updateRangeExtent()
}
