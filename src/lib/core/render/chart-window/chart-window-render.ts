import {ChartPointValid} from "../../../points";
import {select, Selection} from "d3";
import {toolDownloadSVGRender} from "../toolbar/tool-download-svg";
import {layouterRender} from "../../layouter";
import {updateCSSForSelection} from "../../data/breakpoint/breakpoint";
import {resizeEventListener} from "../../resize-event-dispatcher";
import {SVGHTMLElement} from "../../constants/types";
import {ChartWindowValid} from "./chart-window-validation";
import {toolbarRender} from "../toolbar/toolbar-render";

export function chartWindowRender<D extends ChartWindowValid>(selection: Selection<SVGHTMLElement, D>) {
  const data = selection.datum()
  selection.datum(data)
    .classed('chart-window', true)
    .classed(`chart-window-${data.type}`, true)
  updateCSSForSelection(selection)

  const layouterS = selection
    .selectAll<HTMLDivElement, any>('.layouter')
    .data([data])
    .join('div')
    .call((s) => layouterRender(s));

  const chartS = layouterS
    .selectAll<SVGSVGElement, ChartPointValid>(`svg.chart-${data.type}`)
    .data([data])
    .join('svg')

  data.renderer.chartSelection = chartS
  return {chartWindowS: selection, layouterS, chartS}
}


function renderMenu() {
  // category filter
  // const categoryFilterS = menuItemsS
  //   .selectAll<HTMLLIElement, ToolFilterNominal>('.tool-filter-categories')
  //   .data([
  //     toolFilterNominalData({
  //       text: chartWindowD.categoryEntity,
  //       options: chartWindowD.categories,
  //       keys: chartWindowD.categories,
  //     }),
  //   ])
  //   .join('li')
  //   .classed('tool-filter-categories', true)
  //   .call((s) => toolFilterNominalRender(s))
  //   .call((s) =>
  //     s.selectAll('.checkbox input').attr('checked', (d, i) => categoryActiveStates[i])
  //   )
  //   .on('change.chartwindowbar', function (e, filterD) {
  //     const categoryFilterS = select(this);
  //     const checkedStates: boolean[] = [];
  //     const checkboxS = categoryFilterS
  //       .selectAll<Element, Checkbox>('.checkbox')
  //       .each((d, i, g) => checkedStates.push(g[i].querySelector('input')!.checked));
  //     chartWindowS.dispatch('categoryfilter', {
  //       detail: { categoryActiveStates: checkedStates },
  //     });
  //   });
}
