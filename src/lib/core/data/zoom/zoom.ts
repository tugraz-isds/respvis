import {ScaleLinear, ScaleTime, Selection, ZoomTransform} from "d3";
import {ChartPointValid} from "../../../points";
import {throttle} from "../../utilities/d3/util";
import {isScaledValuesCategorical} from "../scale/scaled-values";

type ZoomSelection = Selection<HTMLDivElement, Pick<ChartPointValid, 'zoom' | 'series'>>

export function addZoom(selection: ZoomSelection, callback: (props: {
  xScale:  ScaleTime<number, number, never> | ScaleLinear<number, number, never>,
  yScale:  ScaleTime<number, number, never> | ScaleLinear<number, number, never>
}) => void, throttleMs = 50) {
  const {series, zoom} = selection.datum()
  const drawArea = selection.selectAll('.draw-area')
  function updateScales() {
    if (!zoom) return
    const onZoom = function (e) {
      const transform: ZoomTransform = e.transform
      if (isScaledValuesCategorical(series.x) || isScaledValuesCategorical(series.y)) return
      const xScale = transform.rescaleX(series.x.scale)
      const yScale = transform.rescaleY(series.y.scale)
      callback({xScale, yScale})
    }
    const throttledZoom = throttle(onZoom, throttleMs)
    drawArea.call(
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
