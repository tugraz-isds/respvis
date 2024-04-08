import {Selection} from "d3";

export function clickSAddEnterExitAttributes(clickS: Selection<HTMLElement>, refS: Selection<HTMLElement>, delayMs: number) {
  const refE = refS.node() as HTMLDialogElement
  let timeout
  clickS.on('click', function () {
    const currentTransition = refE.getAttribute('transition')
    if (currentTransition === 'enter') exit()
    else enter()
  })

  function enter() {
    clearTimeout(timeout)
    refE.setAttribute('transition', 'enter')
    timeout = setTimeout(() => {
      refE.setAttribute('transition-state', 'enter-done')
    }, 600)
  }

  function exit() {
    clearTimeout(timeout)
    refE.setAttribute('transition', 'exit')
    timeout = setTimeout(() => {
      refE.setAttribute('transition-state', 'exit-done')
    }, 600)
  }
}
