import {Selection, ZoomTransform} from "d3";
import {throttle} from "../../utilities/d3/util";
import {ScaledValues} from "../scale/scaled-values-base";
import {CartesianChartValid} from "../../render";

type ZoomSelection = Selection<HTMLDivElement, Pick<CartesianChartValid, 'zoom' | 'series'>>

export function addZoom(selection: ZoomSelection, callback: (props: {
  x: ScaledValues, y: ScaledValues
}) => void, throttleMs = 50) {
  const {series, zoom} = selection.datum()
  const pWrapper = selection.selectAll('.draw-area')
  function updateScales() {
    if (!zoom) return
    const onZoom = function (e) {
      const transform: ZoomTransform = e.transform
      const flipped = series.responsiveState.currentlyFlipped
      const x = series.x.cloneZoomed(transform, flipped ? 'y' : 'x')
      const y = series.y.cloneZoomed(transform, flipped ? 'x' : 'y')
      callback({x, y})
    }
    const throttledZoom = throttle(onZoom, throttleMs)
    pWrapper.call(
      zoom.behaviour.scaleExtent([zoom.out, zoom.in])
        .on('zoom.autozoom', (e) => throttledZoom.func(e))
    )
  }
  function updateRangeExtent() {
    if (!zoom) return
    selection.on('resize.autozoom', () => {
      const [x1, widthTranslate] = series.x.scale.range()
      const [y1, heightTranslate] = series.y.scale.range()
      const flipped = series.responsiveState.currentlyFlipped
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
