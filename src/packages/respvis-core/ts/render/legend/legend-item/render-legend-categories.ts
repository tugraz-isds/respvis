import {LegendItem} from "./legend-item";
import {select} from "d3";
import {rectFromString} from "../../../utilities/geometry/shapes/rect/rect";
import {LegendSelection} from "../render-legend";
import {SVGHTMLElementLegacy} from "../../../constants/types";
import {Legend} from "../validate-legend";
import {renderBgSVGOnlyBBox} from "../../element/bg-svg-only";
import {Size} from "../../../utilities/geometry/shapes/rect/size";
import {createLegendItems} from "./create-legend-items";
import {getCurrentResponsiveValue} from "../../../data";

export function renderLegendCategories(legendS: LegendSelection) {

  const legendCategoriesS = legendS.selectAll<SVGHTMLElementLegacy, Legend>('.legend__categories')
    .data([legendS.datum()])
    .join('g')
    .classed('legend__categories', true)

  renderTitle(legendCategoriesS)

  const itemS = legendCategoriesS.selectAll<SVGHTMLElementLegacy, Legend>('.items')
    .data([null])
    .join('g')
    .classed('items', true)


  itemS
    .selectAll<SVGGElement, LegendItem>('.legend-item')
    .data(createLegendItems(legendS.datum()), (d) => d.label)
    .join(
      (enter) =>
        enter
          .append('g')
          .classed('legend-item', true)
          .call((itemS) => itemS.append('path').classed('symbol', true))
          .call((itemS) => itemS.append('text').classed('label', true)),
      undefined,
    )
    .each((itemD, i, g) => {
      const itemS = select(g[i]);
      itemS.selectAll('.label').text(itemD.label);
      itemS.selectAll<SVGPathElement, any>('.symbol').call((symbolS) => {
        const boundsAttr = symbolS.attr('bounds');
        if (!boundsAttr) return;
        //TODO: this is only a temporary fix as layouter does also apply translation which
        // would make it double
        itemD.symbol(symbolS.node()!, {...rectFromString(boundsAttr), x: 0, y: 0} as Size);
      });
      renderBgSVGOnlyBBox(itemS)
    })
    .attr('data-style', (d) => d.styleClass)
    .attr('data-key', (d) => d.key)
    .classed('filter-out', (d) => legendS.datum().series.originalData.categories?.isKeyActiveByKey(d.key) === false)
    .on('click.filter', function (e, d) {
      if (legendS.datum().renderer.exitEnterActive()) return
      legendS.datum().renderer.filterDispatch
        .call('filter', { dataKey: d.key }, this)
    })
    .on('pointerover.legend-item pointerout.legend-item', (e: PointerEvent) => {
      const item = (<Element>e.currentTarget)
      if (item) item.classList.toggle('highlight', e.type.endsWith('over'))
    })
}

function renderTitle(legendS: LegendSelection) {
  const {renderer, title} = legendS.datum()
  //TODO: add self to mapping when legend has breakpoints
  const text = getCurrentResponsiveValue(title, {chart: renderer.chartS})
  legendS
    .selectChildren('.title')
    .data([text])
    .join('text')
    .classed('title', true)
    .classed('empty', d => !d)
    .text(d => d)
}
