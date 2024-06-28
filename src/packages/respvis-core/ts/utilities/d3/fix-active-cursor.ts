import {select, Selection} from "d3";
import {detectClassChange} from "../dom/detect-mutation";

const cursorClasses = [
  'cursor--invert-vertical',
  'cursor--invert-up',
  'cursor--invert-horizontal',
  'cursor--invert-right',
  'cursor--range-vertical',
  'cursor--range-up',
  'cursor--range-horizontal',
  'cursor--range-left',
  'cursor--range-rect',
  'cursor--range-rect-horizontal',
  'cursor--drag-horizontal',
  'cursor--drag-right-only',
  'cursor--drag-left-only',
  'cursor--drag-vertical',
  'cursor--drag-up-only',
  'cursor--drag-down-only',
] as const
type CursorClass = typeof cursorClasses[number]

export function fixActiveCursor(selection: Selection<Element>) {
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
      mutationObserver = detectClassChange(select(nearestCursorElement), () => {
        // console.log('CHANGE!', nearestCursorElement)
        activeCursorClasses.forEach(activeClass => selection.classed(activeClass, false))
        fillActiveClasses(nearestCursorElement)
        activeCursorClasses.forEach(activeClass => selection.classed(activeClass, true))
      })?.observer
    }
  })
  function activateCursors () {
    selection.selectAll('.cursor').classed('cursor-disabled', false)
    activeCursorClasses.forEach(activeClass => selection.classed(activeClass, false))
    selection.classed('cursor', false)
    mutationObserver?.disconnect()
  }
  document.removeEventListener('pointerup', activateCursors)
  document.addEventListener('pointerup', activateCursors)
  return selection
}
