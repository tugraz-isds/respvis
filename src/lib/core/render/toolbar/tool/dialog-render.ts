import {Selection} from "d3";
import {classesForSelection} from "../../../utilities/d3/util";

export function dialogRender(parentS: Selection, ...classes: string[]) {
  const {names} = classesForSelection(classes)
  return parentS.selectAll<HTMLButtonElement, any>('dialog')
    .data([null])
    .join('dialog')
    .classed(names, true)
}

export function bindOpenerToDialog(dialogOpenerS: Selection, dialogS: Selection) {
  const dialogE = dialogS.node() as HTMLDialogElement
  const dialogOpenerE = dialogOpenerS.node() as HTMLDialogElement
  let timeout
  dialogOpenerS
    .on('click', function () {
      const currentTransition = dialogE.getAttribute('transition')
      clearTimeout(timeout)
      if (currentTransition === 'enter') {
        dialogE.setAttribute('transition', 'exit')
        dialogOpenerE.setAttribute('transition', 'exit')

        timeout = setTimeout(() => {
          dialogE.close()
        }, 600)
      } else {
        dialogE.show()
        dialogE.setAttribute('transition', 'enter')
        dialogOpenerE.setAttribute('transition', 'enter')
      }
    })
}
