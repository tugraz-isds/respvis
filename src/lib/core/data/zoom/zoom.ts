import {AxisDomain, AxisScale, Selection, ZoomTransform} from "d3";
import {ChartPointValid} from "../../../points";
import {throttle} from "../../utilities/d3/util";

type ZoomSelection = Selection<HTMLDivElement, Pick<ChartPointValid, 'zoom' | 'series'>>

export function addZoom(selection: ZoomSelection, callback: (props: {
  xScale: AxisScale<AxisDomain>,
  yScale: AxisScale<AxisDomain>
}) => void, throttleMs = 50) {
  const {series, zoom} = selection.datum()
  const drawArea = selection.selectAll('.draw-area')
  function updateScales() {
    if (!zoom) return
    const onZoom = function (e) {
      const transform: ZoomTransform = e.transform
      const xScale = transform.rescaleX(series.xScale)
      const yScale = transform.rescaleY(series.yScale)
      // .range(flipped ? [maxRadius, drawAreaBounds.width - 2 * maxRadius] : [drawAreaBounds.height - maxRadius, maxRadius])
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
      const [x1, widthTranslate] = series.xScale.range()
      const [y1, heightTranslate] = series.yScale.range()
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
