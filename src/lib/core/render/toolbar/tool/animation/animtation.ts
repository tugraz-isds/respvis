import {Selection} from "d3";

export function clickSAddEnterExitAttributes(clickS: Selection<HTMLElement>, refS: Selection<HTMLElement>, delayMs: number) {
  const refE = refS.node() as HTMLDialogElement
  let timeout
  const triggerTransition = () => {
    const currentTransition = refE.getAttribute('transition')
    if (currentTransition === 'enter') exit()
    else enter()
  }
  clickS.on('click.transition', triggerTransition)

  function enter() {
    clearTimeout(timeout)
    refE.setAttribute('transition', 'enter')
    console.log("SET ENTER!")
    timeout = setTimeout(() => {
      refE.setAttribute('transition-state', 'enter-done')
    }, delayMs)
  }

  function exit() {
    clearTimeout(timeout)
    refE.setAttribute('transition', 'exit')
    timeout = setTimeout(() => {
      refE.setAttribute('transition-state', 'exit-done')
    }, delayMs)
  }
}
