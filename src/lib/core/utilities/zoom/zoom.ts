import {AxisDomain, AxisScale, Selection, zoom, ZoomBehavior, ZoomTransform} from "d3";
import {ChartPointData} from "../../../points";
import {throttle} from "../d3/util";

export type ZoomArgs = {
  in: number,
  out: number
}

export type ZoomValid = ZoomArgs & {
  behaviour: ZoomBehavior<Element, unknown>
}

export function validateZoom(args: ZoomArgs): ZoomValid {
  return {
    ...args,
    behaviour: zoom()
  }
}

type ZoomSelection = Selection<HTMLDivElement, Pick<ChartPointData, 'zoom' | 'x' | 'y'>>

export function addZoom(selection: ZoomSelection, callback: (props: {
  xScale: AxisScale<AxisDomain>,
  yScale: AxisScale<AxisDomain>
}) => void, throttleMs = 50) {
  const {x, y, zoom} = selection.datum()
  const drawArea = selection.selectAll('.draw-area')
  function updateScales() {
    if (!zoom) return
    const onZoom = function (e) {
      const transform: ZoomTransform = e.transform
      const xScale = transform.rescaleX(x.scale)
      const yScale = transform.rescaleY(y.scale)
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
      const [x1, widthTranslate] = x.scale.range()
      const [y1, heightTranslate] = y.scale.range()
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
