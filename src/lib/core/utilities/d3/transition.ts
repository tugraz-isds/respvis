import {BaseType, select, Transition} from "d3";

export function addTransitionClass<T extends BaseType, D>(transition: Transition<T, D>) {
  transition
    .each(function() {
      select(this).classed("mid-d3-transit", true);
    })
    .on('end', function() {
      select(this).classed("mid-d3-transit", false);
    })
}
