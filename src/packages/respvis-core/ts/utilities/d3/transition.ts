import {BaseType, select, Selection, Transition} from "d3";

export function addD3TransitionClass<T extends BaseType, D>(transition: Transition<T, D>) {
  transition
    .each(function () {
      select(this).classed("mid-d3-transit", true);
    })
    .on('end', function () {
      select(this).classed("mid-d3-transit", false);
    })
}

export function addD3TransitionClassForSelection<T extends BaseType, D>(s: Selection<T, D>) {
  s.each(function () {
      select(this).classed("mid-d3-transit", true);
  })
}

export function removeD3TransitionClassSelection<T extends BaseType, D>(s: Selection<T, D>) {
  s.each(function () {
    select(this).classed("mid-d3-transit", false);
  })
}


export function addCSSTransitionEnterClass<T extends BaseType, D>(selection: Selection<T, D>, delayMS = 250) {
  selection.classed('animated', true)
    .transition('entering')
    .duration(0)
    .on('end', function () {
      const finishedS = select(this)
      finishedS.classed('entering', true)
        .interrupt('enter-done')
        .interrupt('entering')
        .transition('enter-done')
        .delay(delayMS - 1)
        .on('end', function () {
          select(this).classed('entering', false)
          select(this).classed('enter-done', true)
        })
    })
}

export function addCSSTransitionExitClass<T extends BaseType, D>(selection: Selection<T, D>, delayMS = 250) {
  return selection
    .classed('exiting', true)
    .classed("enter-done", false)
    .transition('exiting')
    .delay(delayMS)
    .on('end.Exit', function () {
      if (!select(this).classed('exiting')) return
      select(this)
        .classed("exiting", false)
        .classed("exit-done", true)
    })
}

export function cancelExitClassOnUpdate<T extends BaseType, D>(selection: Selection<T, D>) {
  return selection.each(function(d, i, g) {
    if (select(g[i]).classed('exiting')) {
      select(g[i]).classed('exiting', false)
      select(g[i]).classed('enter-done', true)
    }
  })
}
