import {Selection} from "d3";
import {menuDropdownRender} from "../../menu-dropdown";

export function toolbarRender(selection: Selection<HTMLDivElement>): void {
  selection.classed('toolbar', true);

  selection
    .selectAll<HTMLDivElement, any>('.menu-tools')
    .data([null])
    .join('div')
    .call((s) => menuToolsRender(s));
}

export function menuToolsRender(selection: Selection<HTMLDivElement>): void {
  selection.call((s) => menuDropdownRender(s)).classed('menu-tools', true);

  selection.selectChildren('.chevron').remove();
  selection.selectChildren('.text').text('☰');
}
