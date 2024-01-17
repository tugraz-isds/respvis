import {
  easeCubicOut,
  ScaleBand,
  scaleBand,
  ScaleContinuousNumeric,
  scaleLinear,
  select,
  Selection,
  Transition
} from 'd3';
import {arrayIs} from '../../core';
import {Rect, rectFitStroke, rectFromString, rectMinimized, rectToAttrs,} from '../../core/utilities/rect';
import {Size} from '../../core/utilities/size';
import {SeriesConfigTooltips, seriesConfigTooltipsData, seriesConfigTooltipsHandleEvents,} from '../../tooltip';
import toPX from 'to-px';
import {SeriesArgs, seriesValidation} from "../../core/render/series";

export interface Bar extends Rect {
  category: string;
  styleClass: string;
  value: number;
  key: string;
}

export type SeriesBarArgs = SeriesArgs & {}

export type SeriesBarValid = SeriesBarArgs & {
  // categories: any[];
  // categoryScale: ScaleBand<any>;
  // values: number[];
  // valueScale: ScaleContinuousNumeric<number, number>;
  //TODO: find out if flipped needed
  flipped?: boolean
}

export function seriesBarData(data: SeriesBarArgs): SeriesBarValid {
  // const categories = data.categories || [];
  return {
    ...seriesValidation(data)
    // bounds: data.bounds || { width: 600, height: 400 },
    // categories: categories,
    // styleClasses: data.styleClasses || 'categorical-0',
    // categoryScale: data.categoryScale || scaleBand().domain(categories).padding(0.1),
    // values: data.values || [],
    // valueScale:
    //   data.valueScale ||
    //   scaleLinear()
    //     .domain([0, Math.max(...(data.values || []))])
    //     .nice(),
    // flipped: data.flipped || false,
    // keys: data.keys || categories,
    // ...seriesConfigTooltipsData<SVGRectElement, Bar>(data),
    // tooltipsEnabled: data.tooltipsEnabled || true,
    // tooltips:
    //   data.tooltips || ((element, data) => `Category: ${data.category}<br/>Value: ${data.value}`),
  };
}

export function seriesBarCreateBars(seriesData: SeriesBarValid): Bar[] {
  const {x, y, key: seriesKey, legend, renderer, flipped, bounds} = seriesData;
  //categories, categoryScale, values, valueScale, keys, styleClasses
  // if (!flipped) {
  //   categoryScale.range([0, bounds.width]);
  //   valueScale.range([bounds.height, 0]);
  // } else {
  //   categoryScale.range([0, bounds.height]);
  //   valueScale.range([0, bounds.width]);
  // }

  const data: Bar[] = [];

  for (let i = 0; i < y.values.length; ++i) {
    const xVal = x.values[i]
    const yVal = y.values[i]
    const category = x.categories[i]
    const seriesCategory = `s-${seriesKey} c-${x.categoryOrder[category]}`
    if (!legend.keysActive[seriesCategory]) continue
    const key = `s-${seriesKey} c-${x.categoryOrder[category]} i-${i}`
    const bar: Bar = {
      x: x.scale(xVal)!,
      y: Math.min(y.scale(0)!, y.scale(yVal)!),
      width: x.scale.bandwidth(),
      height: Math.abs(y.scale(0)! - y.scale(yVal)!),
      category: legend.labelCallback(xVal),
      styleClass: `categorical-${x.categoryOrder[category]}`,
      key,
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
