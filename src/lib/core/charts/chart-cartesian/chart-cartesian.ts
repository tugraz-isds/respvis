import {select, Selection} from 'd3';
import {Axis, axisBottomRender, axisData, axisLeftRender} from '../../axis';
import {IChartCartesianData} from "./IChartCartesianData";
import {IChartCartesianArgs} from "./IChartCartesianArgs";

export function chartCartesianData(data: IChartCartesianArgs): IChartCartesianData {
  return {
    title: data.title || '',
    subtitle: data.subtitle || '',
    xAxis: axisData(data.xAxis || {}),
    yAxis: axisData(data.yAxis || {}),
    flipped: data.flipped || false,
  };
}

export type ChartCartesianSelection = Selection<SVGSVGElement | SVGGElement, IChartCartesianData>;

export function chartCartesianAxisRender(selection: ChartCartesianSelection): void {
  selection
    .each(function ({ flipped, xAxis, yAxis }, i, g) {
      const s = <ChartCartesianSelection>select(g[i]);
      const flippedBool = flipped ? flipped : false

      s.selectAll<SVGGElement, Axis>('.axis-left')
        .data([flipped ? xAxis : yAxis])
        .join('g')
        .call((s) => axisLeftRender(s))
        .classed('axis-x', flippedBool)
        .classed('axis-y', !flipped);

      s.selectAll<SVGGElement, Axis>('.axis-bottom')
        .data([flipped ? yAxis : xAxis])
        .join('g')
        .call((s) => axisBottomRender(s))
        .classed('axis-x', !flipped)
        .classed('axis-y', flippedBool);
    })
    .attr('data-flipped', (d) => d.flipped ? d.flipped : false);
}

export enum LegendPosition {
  Top = 'top',
  Right = 'right',
  Bottom = 'bottom',
  Left = 'left',
}

export function chartLegendPosition(
  chartSelection: Selection<SVGSVGElement | SVGGElement>,
  position: LegendPosition
): void {
  chartSelection.attr('data-legend-position', position);
}
