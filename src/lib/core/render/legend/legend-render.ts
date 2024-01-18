import {rectFromString} from "../../index";
import {select, Selection} from "d3";
import {elementFromSelection} from "../../utilities/d3/util";
import {LegendItem} from "./legend-item-validation";
import {SVGHTMLElement} from "../../constants/types";
import {legendItemData} from "./legend-item-validation";
import {LegendValid} from "./legend-validation";
import {getCurrentResponsiveValue} from "../../data/responsive-value/responsive-value";

export type LegendSelection = Selection<SVGHTMLElement, LegendValid>

export function legendRender(parentS: Selection, data: LegendValid): LegendSelection {
  const chartElement = elementFromSelection(data.renderer.chartSelection)
  const legendS = parentS
    .selectAll<SVGGElement, LegendValid>('.legend')
    .data([data])
    .join('g')
    .classed('legend', true)
  data.renderer.legendSelection = legendS

  legendS.each((legendD, i, g) => {
    const legendS = select<SVGHTMLElement, LegendValid>(g[i])
    const legendElement = elementFromSelection(legendS)

    legendS
      .selectAll('.title')
      .data([null])
      .join('text')
      .classed('title', true)
      .text(getCurrentResponsiveValue(legendD.title, {chart: chartElement, self: legendElement}));

    const itemS = legendS.selectAll('.items').data([null]).join('g').classed('items', true);

    itemS
      .selectAll<SVGGElement, LegendItem>('.legend-item')
      .data(legendItemData(legendD), (d) => d.label)
      .join(
        (enter) =>
          enter
            .append('g')
            .classed('legend-item', true)
            .call((itemS) => itemS.append('path').classed('symbol', true))
            .call((itemS) => itemS.append('text').classed('label', true))
            .call((s) => legendS.dispatch('enter', {detail: {selection: s}})),
        undefined,
        (exit) => exit.remove().call((s) => legendS.dispatch('exit', {detail: {selection: s}}))
      )
      .each((itemD, i, g) => {
        const itemS = select(g[i]);
        itemS.selectAll('.label').text(itemD.label);
        itemS.selectAll<SVGPathElement, any>('.symbol').call((symbolS) => {
          const boundsAttr = symbolS.attr('bounds');
          if (!boundsAttr) return;
          itemD.symbol(symbolS.node()!, rectFromString(boundsAttr));
        });
      })
      .attr('data-style', (d) => d.styleClass)
      .attr('data-key', (d) => d.key)
      .call((s) => legendS.dispatch('update', {detail: {selection: s}}));
  })

  legendS.on('pointerover.legend pointerout.legend', (e: PointerEvent) => {
    const item = (<Element>e.target).closest('.legend-item');
    if (item) {
      item.classList.toggle('highlight', e.type.endsWith('over'));
    }
  })

  return legendS
}
