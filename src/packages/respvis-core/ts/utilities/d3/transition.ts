import {BaseType, select, Selection, Transition} from "d3";

export function addTransitionClass<T extends BaseType, D>(transition: Transition<T, D>) {
  transition
    .each(function () {
      select(this).classed("mid-d3-transit", true);
    })
    .on('end', function () {
      select(this).classed("mid-d3-transit", false);
    })
}

export function addTransitionClassSelection<T extends BaseType, D>(s: Selection<T, D>) {
  s.each(function () {
      select(this).classed("mid-d3-transit", true);
  })
}

export function removeTransitionClassSelection<T extends BaseType, D>(s: Selection<T, D>) {
  s.each(function () {
    select(this).classed("mid-d3-transit", false);
  })
}

// export function addEnterClass<T extends BaseType, D>(selection: Selection<T, D>, delayMS = 250) {
//   function delayEntering() {
//     return selection.classed('animated', true)
//       .transition('entering')
//       .duration(1)
//   }
//
//   function markEnteringDelayEnteringDone() {
//     return select(this).classed('entering', true)
//       .transition('enter-done')
//       .delay(delayMS - 1)
//       .on('end', markEnteringDone)
//   }
//
//   function markEnteringDone() {
//     select(this).classed('entering', false)
//     select(this).classed('enter-done', true)
//   }
//
//   return delayEntering().on('end', markEnteringDelayEnteringDone)
// }

export function addEnterClass<T extends BaseType, D>(selection: Selection<T, D>, delayMS = 250) {
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

export function addExitClass<T extends BaseType, D>(selection: Selection<T, D>, delayMS = 250) {
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
