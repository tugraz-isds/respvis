import {easeCubicOut, select, Selection, Transition} from 'd3';
import {Rect, rectFitStroke, rectFromString, rectMinimized, rectToAttrs,} from '../../core/utilities/rect';
import {seriesConfigTooltipsHandleEvents,} from '../../tooltip';
import toPX from 'to-px';
import {getSeriesItemCategoryData, SeriesArgs, SeriesValid, seriesValidation} from "../../core/render/series";
import {getCurrentRespVal} from "../../core/data/responsive-value/responsive-value";
import {elementFromSelection} from "../../core/utilities/d3/util";
import {isScaledValuesCategorical} from "../../core/data/scale/scaled-values";
import {getAdaptedScale} from "../../core";

export interface Bar extends Rect {
  category: string;
  styleClass: string;
  value: number;
  key: string;
}

export type SeriesBarArgs = SeriesArgs & {}

export type SeriesBarValid = SeriesValid & {}

export function seriesBarValidation(data: SeriesBarArgs): SeriesBarValid {
  return {
    ...seriesValidation(data)
  };
}

export function seriesBarCreateBars(seriesData: SeriesBarValid): Bar[] {
  const { renderer,
    x, y,
    keysActive, key: seriesKey,
  } = seriesData
  const flipped = getCurrentRespVal(seriesData.flipped, {chart: elementFromSelection(renderer.chartSelection)})
  const data: Bar[] = []

  if (!keysActive[seriesKey]) return data
  for (let i = 0; i < y.values.length; ++i) {
    const xVal = x.values[i]
    const yVal = y.values[i]
    const xScale = getAdaptedScale(x)
    const yScale = getAdaptedScale(y)
    const {key, seriesCategory, styleClass, label,
    axisCategoryKeyX, axisCategoryKeyY } = getSeriesItemCategoryData(seriesData, i)

    if (keysActive[seriesCategory] === false) continue
    if (isScaledValuesCategorical(x) && x.keysActive[axisCategoryKeyX] === false ||
      isScaledValuesCategorical(y) && y.keysActive[axisCategoryKeyY] === false) continue

    const bar: Bar = {
      x: flipped ? Math.min(yScale(0)!, yScale(yVal)!) : xScale(xVal)!,
      y: flipped ? x.scale(xVal)! : Math.min(yScale(0)!, yScale(yVal)!),
      width: flipped ? Math.abs(yScale(0)! - yScale(yVal)!) : xScale.bandwidth(),
      height: flipped ? xScale.bandwidth() : Math.abs(yScale(0)! - yScale(yVal)!),
      category: label,
      styleClass, key,
    }
    data.push(bar);
  }
  return data;
}

export function seriesBarRender(selection: Selection<Element, SeriesBarValid>): void {
  selection
    .classed('series-bar', true)
    .attr('data-ignore-layout-children', true)
    .each((d, i, g) => {
      const seriesS = select<Element, SeriesBarValid>(g[i]);
      const boundsAttr = seriesS.attr('bounds');
      if (!boundsAttr) return;
      d.bounds = rectFromString(boundsAttr);
      seriesS
        .selectAll<SVGRectElement, Bar>('rect')
        .data(seriesBarCreateBars(d), (d) => d.key)
        .call((s) => seriesBarJoin(seriesS, s));
    })
    .on('pointerover.seriesbarhighlight pointerout.seriesbarhighlight', (e: PointerEvent) =>
      (<Element>e.target).classList.toggle('highlight', e.type.endsWith('over'))
    )
    .call((s) => seriesConfigTooltipsHandleEvents(s));
}

export interface JoinEvent<GElement extends Element, Datum>
  extends CustomEvent<{ selection: Selection<GElement, Datum> }> {
}

export interface JoinTransitionEvent<GElement extends Element, Datum>
  extends CustomEvent<{ transition: Transition<GElement, Datum> }> {
}

export function seriesBarJoin(
  seriesSelection: Selection,
  joinSelection: Selection<SVGRectElement, Bar>
): void {
  joinSelection
    .join(
      (enter) =>
        enter
          .append('rect')
          .classed('bar', true)
          .each((d, i, g) => rectToAttrs(select(g[i]), rectMinimized(d)))
          .call((s) => seriesSelection.dispatch('enter', {detail: {selection: s}})),
      undefined,
      (exit) =>
        exit
          .classed('exiting', true)
          .each((d, i, g) =>
            select(g[i])
              .transition('minimize')
              .duration(250)
              .call((t) => rectToAttrs(t, rectMinimized(d)))
              .remove()
          )
          .call((s) => seriesSelection.dispatch('exit', {detail: {selection: s}}))
    )
    .each((d, i, g) =>
      select(g[i])
        .transition('position')
        .duration(250)
        .ease(easeCubicOut)
        .call((t) => rectToAttrs(t, rectFitStroke(d, toPX(select(g[i]).style('stroke-width')!)!)))
    )
    .attr('data-style', (d) => d.styleClass)
    .attr('data-category', (d) => d.category)
    .attr('data-key', (d) => d.key)
    .call((s) => seriesSelection.dispatch('update', {detail: {selection: s}}));
}
