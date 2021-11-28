import { Selection } from 'd3-selection';

export function menuDropdown(selection: Selection<HTMLElement>): void {
  selection.classed('menu', true);

  // chevron & text
  selection.selectChildren('.chevron').data([null]).join('span').text('❮').classed('chevron', true);
  selection.selectChildren('.text').data([null]).join('span').classed('text', true);

  // items
  selection.selectChildren('.items').data([null]).join('ul').classed('items', true);
}
