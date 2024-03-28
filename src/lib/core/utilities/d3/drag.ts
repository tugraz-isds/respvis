import {D3DragEvent, D3ZoomEvent, Selection} from "d3";

export function relateDragWayToSelection(e: D3ZoomEvent<any, any> | D3DragEvent<any, any, any>, selection: Selection<Element>) {
  const rect = selection.node()?.getBoundingClientRect()
  const event = e.sourceEvent
  if (!rect || !event) return undefined

  let mouseX = event.clientX - rect.left
  let mouseY = event.clientY - rect.top
  mouseX = mouseX < 0 ? 0 : mouseX > rect.width ? rect.width : mouseX
  mouseY = mouseY < 0 ? 0 : mouseY > rect.height ? rect.height : mouseY
  const percentX = mouseX / rect.width
  const percentY = mouseY / rect.height
  return {percentX, percentY}
}
