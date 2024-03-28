import {D3DragEvent, D3ZoomEvent, Selection} from "d3";

export function relateDragWayToSelection(e: D3ZoomEvent<any, any> | D3DragEvent<any, any, any>, selection: Selection<Element>) {
  const rect = selection.node()?.getBoundingClientRect()
  const event = e.sourceEvent
  if (!rect || !event) return undefined

  let fromLeftTotal = event.clientX - rect.left
  let fromTopTotal = event.clientY - rect.top
  fromLeftTotal = fromLeftTotal < 0 ? 0 : fromLeftTotal > rect.width ? rect.width : fromLeftTotal
  fromTopTotal = fromTopTotal < 0 ? 0 : fromTopTotal > rect.height ? rect.height : fromTopTotal
  const fromLeftPercent = fromLeftTotal / rect.width
  const fromTopPercent = fromTopTotal / rect.height
  return {fromLeftPercent, fromTopPercent}
}
