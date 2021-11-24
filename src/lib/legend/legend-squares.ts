import { select, Selection } from 'd3-selection';
import { arrayIs, debug, nodeToString, classOneOfEnum } from '../core';

export enum LegendPosition {
  Top = 'with-legend-top',
  Right = 'with-legend-right',
  Bottom = 'with-legend-bottom',
  Left = 'with-legend-left',
}

export function classLegendPosition(selection: Selection, position: LegendPosition): void {
  classOneOfEnum(selection, LegendPosition, position);
}

export enum LegendOrientation {
  Vertical = 'vertical',
  Horizontal = 'horizontal',
}

export function classLegendOrientation(selection: Selection, orientation: LegendOrientation): void {
  classOneOfEnum(selection, LegendOrientation, orientation);
}

export interface LegendSquaresItem {
  label: string;
  index: number;
  key: string;
}

export interface LegendSquares {
  title: string;
  labels: string[];
  indices?: number[];
  keys?: string[];
}

export function legendSquaresData(data: Partial<LegendSquares>): LegendSquares {
  const labels = data.labels || [];
  return {
    title: data.title || '',
    labels,
    keys: data.keys,
  };
}

export function legendSquaresCreateItems(legendData: LegendSquares): LegendSquaresItem[] {
  const { labels, indices, keys } = legendData;

  return labels.map((l, i) => {
    return {
      label: l,
      index: indices === undefined ? i : indices[i],
      key: keys === undefined ? l : keys[i],
    };
  });
}

export function legendSquares(selection: Selection<Element, LegendSquares>): void {
  selection.classed('legend', true).classed('legend-squares', true);
  selection.append('text').classed('title', true).classed('horizontal', true);

  selection.append('g').classed('items', true);

  selection.on('mouseover.legend mouseout.legend', (e: MouseEvent) => {
    const item = (<Element>e.target).closest('.legend-item');
    if (item) {
      item.classList.toggle('highlight', e.type.endsWith('over'));
    }
  });

  selection
    .on('datachange.legend', function () {
      debug(`data change on ${nodeToString(this)}`);
      select(this).dispatch('render');
    })
    .on('render.legend', function (e, d) {
      debug(`render squares legend on ${nodeToString(this)}`);
      const legend = select<Element, LegendSquares>(this);

      legend.selectAll('.title').text(d.title);

      legend
        .selectAll('.items')
        .selectAll<SVGGElement, LegendSquaresItem>('.legend-item')
        .data(legendSquaresCreateItems(d), (d) => d.label)
        .join(
          (enter) =>
            enter
              .append('g')
              .classed('legend-item', true)
              .call((s) => s.append('rect').classed('symbol', true))
              .call((s) => s.append('text').classed('label', true))
              .call((s) => legend.dispatch('enter', { detail: { selection: s } })),
          undefined,
          (exit) => exit.remove().call((s) => legend.dispatch('exit', { detail: { selection: s } }))
        )
        .attr('index', (d) => d.index)
        .attr('data-key', (d) => d.key)
        .each((d, i, g) => {
          select(g[i]).selectAll('.label').text(d.label);
        })
        .call((s) => legend.dispatch('update', { detail: { selection: s } }));
    });
}
