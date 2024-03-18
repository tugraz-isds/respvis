import {Selection} from "d3";
import {classesForSelection} from "../../../utilities/d3/util";

export function buttonRender(parentS: Selection, ...classes: string[]) {
  const {names, selector} = classesForSelection(classes)
  return parentS.selectAll<HTMLButtonElement, any>(selector)
    .data([null])
    .join('button')
    .classed(names, true)
}

export function buttonAddEnterExitAttributes(buttonS: Selection) {
  const buttonE = buttonS.node() as HTMLDialogElement
  buttonS.on('click.EnterExit', function () {
    const currentTransition = buttonE.getAttribute('transition')
    buttonE.setAttribute('transition', currentTransition === 'enter' ? 'exit' : 'enter')
  })
}
