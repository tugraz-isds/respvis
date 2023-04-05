import {findMatchingBoundsIndex} from "../libs/respvis/respvis.js";
import {select} from "../libs/d3-7.6.0/d3.js";

const bounds = [
  { minWidth: '50rem', maxWidth: '60rem' },
  { minWidth: '40rem', maxWidth: '50rem' },
  { maxWidth: '40rem'},
]

export function chooseAxisFormat(axis, data) {
  const index = findMatchingBoundsIndex(document.documentElement, bounds)
  console.log(index)
  switch (index) {
    case 0: layoutAxisLabel(axis, 'vertical'); break
    case 1: layoutAxisLabel(axis, 'horizontal'); break
    case 2: layoutAxisLabel(axis, 'vertical'); break
    default: layoutAxisLabel(axis, 'horizontal'); break
  }
}

function layoutAxisLabel(axis, orientation) {
  // select(axis).selectAll('text').attr('transform', 'rotate(90)')
  //   .style('text-anchor', 'start')
  //   .style('dominant-baseline', 'central')
  select(axis).selectAll('text').attr('orientation', orientation)
}
