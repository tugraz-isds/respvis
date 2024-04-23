import {Selection} from "d3";
import {classesForSelection} from "../../../utilities/d3/util";

export type DialogData = {
  toggleTimeout: NodeJS.Timeout | undefined
  triggerEnter: () => void
  triggerExit: () => void
  onClickOutside: (e: MouseEvent) => void
  onOpenerClick?: () => void
}

export function dialogRender(parentS: Selection, ...classes: string[]) {
  const {names, selector} = classesForSelection(classes)
  const dialogS = parentS.selectAll<HTMLDialogElement, DialogData>(selector)
  const toggleTimeout = dialogS.empty() ? undefined : dialogS.datum().toggleTimeout
  return dialogS
    .data([{
      triggerEnter: () => {},
      triggerExit: () => {},
      onClickOutside: () => {},
      toggleTimeout
    }])
    .join('dialog')
    .classed(names, true)
}

type OpenDialogOptions = {
  dialogOpenerS: Selection<HTMLElement>,
  dialogS: Selection<HTMLElement, DialogData>,
  transitionMS: number,
  type?: 'modal' | 'modeless'
}

export function bindOpenerToDialog(props: OpenDialogOptions) {
  const {dialogOpenerS, dialogS, transitionMS, type = 'modeless'} = props
  const dialogE = dialogS.node() as HTMLDialogElement

  dialogOpenerS.on('click.dialog', function () {
      dialogS.datum().onOpenerClick?.()
      const currentTransition = dialogE.getAttribute('transition')
      if (currentTransition === 'enter') exit()
      else enter()
  })

  function enter() {
    clearTimeout(dialogS.datum().toggleTimeout)
    type === 'modal' ? dialogE.showModal() : dialogE.show()
    dialogS.attr('transition', 'enter')
    dialogS.datum().toggleTimeout = setTimeout(() => {
      dialogS.attr('transition-state', 'enter-done')
    }, transitionMS)
  }

  function exit() {
    clearTimeout(dialogS.datum().toggleTimeout)
    dialogS.attr('transition', 'exit')
    dialogS.datum().toggleTimeout = setTimeout(() => {
      dialogS.attr('transition-state', 'exit-done')
      dialogE.close()
    }, transitionMS)
  }

  dialogS.datum().triggerEnter = () => enter()
  dialogS.datum().triggerExit = () => exit()
  dialogS.datum().onClickOutside = (e: MouseEvent) => {
    if (!e.target || !(e.target instanceof HTMLDialogElement)) return
    const rect = e.target.getBoundingClientRect();

    const clickedInDialog = rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX && e.clientX <= rect.left + rect.width

    if (!clickedInDialog) {
      console.log(rect, e.clientX, e.clientY)
      dialogS.datum().triggerExit()
    }
  }

  dialogS.on('click.Outside', (e: MouseEvent) => {
    dialogS.datum().onClickOutside(e)
  })
}
