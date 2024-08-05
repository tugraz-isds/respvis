import {D3DragEvent, Selection} from "d3";
import {cursorClasses} from "../../constants/dom/cursor";
import {detectClassChange} from "../dom";
import {calcLimited} from "../math";
import {elementFromSelection} from "./selection";

export function relateDragWayToSelection(e: MouseEvent | TouchEvent, selection: Selection<Element>) {
  const rect = selection.node()?.getBoundingClientRect()
  if (!rect || !e || (e instanceof TouchEvent && e.touches?.[0] === undefined)) return undefined

  const pointerPositionX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX
  const pointerPositionY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY

  const fromLeftTotal = calcLimited(pointerPositionX - rect.left, 0, rect.width)
  const fromTopTotal = calcLimited(pointerPositionY - rect.top, 0, rect.height)

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

export function hasDrag(s: Selection) {
  return s.empty() ? false : !!elementFromSelection(s)
    ?.['__on']?.find(listener => 'name' in listener && listener.name === 'drag')
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
