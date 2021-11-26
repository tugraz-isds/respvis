import { easeCubicOut } from 'd3-ease';
import { select, Selection, ValueFn } from 'd3-selection';
import { debug, nodeToString, Position, positionToTransformAttr } from '../core';

export interface Label extends Position {
  text: string;
  key: string;
}

export interface SeriesLabel {
  texts: string[];
  positions: Position[];
  keys?: string[];
}

export function seriesLabelData(data: Partial<SeriesLabel>): SeriesLabel {
  return {
    texts: data.texts || [],
    positions: data.positions || [],
    keys: data.keys,
  };
}

export function seriesLabelCreateLabels(seriesData: SeriesLabel): Label[] {
  const { texts, keys, positions } = seriesData;
  return texts.map((text, i) => ({
    text: text,
    key: keys?.[i] || text,
    ...positions[i],
  }));
}

export function seriesLabel(selection: Selection<Element, SeriesLabel>): void {
  selection
    .classed('series-label', true)
    .attr('data-ignore-layout-children', true)
    .on('datachange.serieslabel', function () {
      debug(`data change on ${nodeToString(this)}`);
      select(this).dispatch('render');
    })
    .on('render.serieslabel', function (e, d) {
      debug(`render label series on ${nodeToString(this)}`);
      const series = select<Element, SeriesLabel>(this);
      series
        .selectAll<SVGTextElement, Label>('text')
        .data(seriesLabelCreateLabels(d), (d) => d.key)
        .call((s) => seriesLabelJoin(series, s));
    });
}

export function seriesLabelJoin(
  seriesSelection: Selection,
  joinSelection: Selection<Element, Label>
): void {
  joinSelection
    .join(
      (enter) =>
        enter
          .append('text')
          .classed('label', true)
          .each((d, i, g) => positionToTransformAttr(select(g[i]), d))
          .attr('font-size', '0em')
          .attr('opacity', 0)
          .call((s) =>
            s.transition('enter').duration(250).attr('font-size', '1em').attr('opacity', 1)
          )
          .call((s) => seriesSelection.dispatch('enter', { detail: { selection: s } })),
      undefined,
      (exit) =>
        exit
          .classed('exiting', true)
          .call((s) =>
            s.transition('exit').duration(250).attr('font-size', '0em').attr('opacity', 0).remove()
          )
          .call((s) => seriesSelection.dispatch('exit', { detail: { selection: s } }))
    )
    .each((d, i, g) =>
      select(g[i])
        .transition('position')
        .duration(250)
        .ease(easeCubicOut)
        .call((t) => positionToTransformAttr(t, d))
    )
    .text((d) => d.text)
    .attr('data-key', (d) => d.key)
    .call((s) => seriesSelection.dispatch('update', { detail: { selection: s } }));
}
