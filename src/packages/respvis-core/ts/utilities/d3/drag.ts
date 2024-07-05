import {D3DragEvent, D3ZoomEvent, Selection} from "d3";
import {cursorClasses} from "../../constants/dom/cursor";
import {detectClassChange} from "../dom";

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

export function relateDragWayToSelectionByDiff(e: D3DragEvent<any, any, any>, selection: Selection<Element>) {
  const rect = selection.node()?.getBoundingClientRect()
  if (!rect) return undefined
  const dyRelative = e.dy / rect.height
  const dxRelative = e.dx / rect.width
  return {dyRelative, dxRelative}
}

export function attachActiveCursorLocking(selection: Selection<Element>) {
  let activeCursorClasses: string[] = []
  let mutationObserver: MutationObserver | undefined
  selection.on('pointerdown.fixCursor', (event: Event) => {
    if (!(event.target instanceof Element)) return;
    const nearestCursorElement = (event.target as Element).closest('.cursor')
    if (!nearestCursorElement) return
    fillActiveClasses(nearestCursorElement)
    updateCursorClasses(nearestCursorElement)

    function fillActiveClasses(nearestCursorElement: Element) {
      activeCursorClasses.length = 0
      cursorClasses.forEach(cursorClass => {
        if (nearestCursorElement.classList.contains(cursorClass)) activeCursorClasses.push(cursorClass)
      })
    }

    //For e.g. detecting cursor change on dragging axis from center to edge
    function updateCursorClasses(nearestCursorElement: Element) {
      selection.selectAll('.cursor').classed('cursor-disabled', true)
      activeCursorClasses.forEach(activeClass => selection.classed(activeClass, true))
      selection.classed('cursor', true)
      mutationObserver = detectClassChange(nearestCursorElement, () => {
        // console.log('CHANGE!', nearestCursorElement)
        activeCursorClasses.forEach(activeClass => selection.classed(activeClass, false))
        fillActiveClasses(nearestCursorElement)
        activeCursorClasses.forEach(activeClass => selection.classed(activeClass, true))
      })?.observer
    }
  })

  function activateCursors() {
    selection.selectAll('.cursor').classed('cursor-disabled', false)
    activeCursorClasses.forEach(activeClass => selection.classed(activeClass, false))
    selection.classed('cursor', false)
    mutationObserver?.disconnect()
  }

  document.removeEventListener('pointerup', activateCursors)
  document.addEventListener('pointerup', activateCursors)
  return selection
}
