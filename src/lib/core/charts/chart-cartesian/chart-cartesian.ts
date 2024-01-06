import {select, Selection} from 'd3';
import {axisBottomRender, axisData, axisLeftRender, AxisPropagation, AxisValid} from "../../axes";
import {IChartCartesianData} from "./IChartCartesianData";
import {IChartCartesianArgs} from "./IChartCartesianArgs";

export function chartCartesianData(data: IChartCartesianArgs): IChartCartesianData {
  return {
    title: data.title || '',
    subTitle: data.subTitle || '',
    xAxis: axisData(data.xAxis || {}),
    yAxis: axisData(data.yAxis || {}),
    flipped: data.flipped || false,
  };
}

export type ChartCartesianSelection = Selection<SVGSVGElement | SVGGElement, IChartCartesianData>;

export function chartCartesianAxisRender(selection: ChartCartesianSelection): void {
  selection
    .classed('chart-cartesian', true)
    .each(function ({ flipped, x, y, selection}, i, g) {
      const s = <ChartCartesianSelection>select(g[i]);
      const flippedBool = flipped ? flipped : false

      s.selectAll<SVGGElement, AxisPropagation>('.axis-left')
        .data([{...(flipped ? x : y), selection}])
        .join('g')
        .call((s) => axisLeftRender(s))
        .classed('axis-x', flippedBool)
        .classed('axis-y', !flipped);

      s.selectAll<SVGGElement, AxisValid>('.axis-bottom')
        .data([{...(flipped ? y : x), selection}])
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
