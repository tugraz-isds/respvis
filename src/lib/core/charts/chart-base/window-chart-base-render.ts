import { Selection } from 'd3';
import { layouterRender } from '../../layouter';
import { menuDropdownRender } from '../../menu-dropdown';
import { resizeEventListener } from '../../resize-event-dispatcher';
import {elementFromSelection} from "../../utilities/d3/util";
import {updateBoundStateInCSS} from "../../utilities/resizing/bounds";
import {ChartBaseValid} from "./chart-base-validation";

export function windowChartBaseRender(selection: Selection<HTMLDivElement, ChartBaseValid>): void {
  const chartWindowElement = elementFromSelection(selection)
  const chartBaseValid = selection.data()[0]
  updateBoundStateInCSS(chartWindowElement, chartBaseValid.bounds)

  selection.classed('chart-window', true);

  selection
    .selectAll<HTMLDivElement, any>('.toolbar')
    .data([null])
    .join('div')
    .call((s) => toolbarRender(s));

  selection
    .selectAll<HTMLDivElement, any>('.layouter')
    .data([null])
    .join('div')
    .call((s) => layouterRender(s));

  resizeEventListener(selection);
}

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
