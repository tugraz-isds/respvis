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

export function addEnterClass<T extends BaseType, D>(selection: Selection<T, D>, delayMS = 250) {
  function delayEntering() {
    return selection.classed('animated', true)
      .transition('entering')
      .duration(1)
  }

  function markEnteringDelayEnteringDone() {
    return select(this).classed('entering', true)
      .transition('enter-done')
      .delay(delayMS - 1)
      .on('end', markEnteringDone)
  }

  function markEnteringDone() {
    select(this).classed('entering', false)
    select(this).classed('enter-done', true)
  }

  return delayEntering().on('end', markEnteringDelayEnteringDone)
}

export function addExitClass<T extends BaseType, D>(selection: Selection<T, D>, delayMS = 250) {
  return selection
    .classed('exiting', true)
    .classed("enter-done", false)
    .transition('exiting')
    .delay(delayMS)
    .on('end.Exit', function () {
      select(this)
        .classed("exiting", false)
        .classed("exit-done", true);
    })
}
