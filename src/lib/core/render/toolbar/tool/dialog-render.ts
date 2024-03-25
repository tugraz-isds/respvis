import {Selection} from "d3";
import {classesForSelection} from "../../../utilities/d3/util";

export type DialogData = {
  toggleTimeout: NodeJS.Timeout | undefined
  triggerEnter: () => void
  triggerExit: () => void
  onOpenerClick?: () => void
}

export function dialogRender(parentS: Selection, ...classes: string[]) {
  const {names} = classesForSelection(classes)
  const dialogS = parentS.selectAll<HTMLDialogElement, DialogData>('dialog')
  const toggleTimeout = dialogS.empty() ? undefined : dialogS.datum().toggleTimeout
  return parentS.selectAll<HTMLDialogElement, DialogData>('dialog')
    .data([{
      triggerEnter: () => {},
      triggerExit: () => {},
      toggleTimeout
    }])
    .join('dialog')
    .classed(names, true)
}

export function bindOpenerToDialog(dialogOpenerS: Selection, dialogS: Selection<HTMLDialogElement, DialogData>) {
  const dialogE = dialogS.node() as HTMLDialogElement
  const dialogOpenerE = dialogOpenerS.node() as HTMLDialogElement
  dialogOpenerS.on('click', function () {
      dialogS.datum().onOpenerClick?.()
      const currentTransition = dialogE.getAttribute('transition')
      if (currentTransition === 'enter') exit()
      else enter()
  })

  function enter() {
    clearTimeout(dialogS.datum().toggleTimeout)
    dialogE.show()
    dialogE.setAttribute('transition', 'enter')
    dialogOpenerE.setAttribute('transition', 'enter')
  }

  function exit() {
    clearTimeout(dialogS.datum().toggleTimeout)
    dialogE.setAttribute('transition', 'exit')
    dialogOpenerE.setAttribute('transition', 'exit')

    dialogS.datum().toggleTimeout = setTimeout(() => {
      dialogE.close()
    }, 600)
  }

  dialogS.datum().triggerEnter = () => enter()
  dialogS.datum().triggerExit = () => exit()
}

// function closeDialog(dialogS: Selection) {
//   const dialogE = dialogS.node() as HTMLDialogElement
//   const dialogOpenerE = dialogOpenerS.node() as HTMLDialogElement
//
//   dialogE.setAttribute('transition', 'exit')
//   dialogOpenerE.setAttribute('transition', 'exit')
//
//   timeout = setTimeout(() => {
//     dialogE.close()
//   }, 600)
// }
