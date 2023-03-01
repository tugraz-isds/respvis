import {select, Selection} from 'd3';
import {rectFromString} from '../core';
import {chartCartesianAxesRender, chartCartesianRender,} from '../core/chart-cartesian';
import {SeriesPoint, seriesPointData, seriesPointRender} from './series-point';
import {Legend, legendRender} from "../legend";
import {ChartPointData} from "./chart-point-data";

export type ChartPointSelection = Selection<SVGSVGElement | SVGGElement, ChartPointData>;

export function chartPointRender(selection: ChartPointSelection): void {
  selection
    .call((s) => chartCartesianRender(s))
    .classed('chart-point', true)
    .each((chartD, i, g) => {
      const drawAreaS = select(g[i]).selectAll('.draw-area');
      const drawAreaBounds = rectFromString(drawAreaS.attr('bounds') || '0, 0, 600, 400');
      const { flipped, legend, pointSeries, xScale, yScale } = chartD;

      xScale.range(flipped ? [drawAreaBounds.height, 0] : [0, drawAreaBounds.width]);
      yScale.range(flipped ? [0, drawAreaBounds.width] : [drawAreaBounds.height, 0]);

        drawAreaS
        .selectAll<SVGSVGElement, ChartPointData>('.series-point').data<SeriesPoint>(
            pointSeries.map((p) =>
                seriesPointData({
                  styleClasses: p.styleClasses,
                  keys: p.keys,
                  xValues: p.xValues,
                  yValues: p.yValues,
                  radiuses: p.radiuses,
                  xScale, yScale, flipped
                })
        )).join('svg')
            .call((s) => seriesPointRender(s))
        // .data([chartD]) //TODO: insert categories here
        // .join('svg')
        // .call((s) => seriesPointRender(s));

      selection
        .selectAll<SVGGElement, Legend>('.legend')
        .data([legend])
        .join('g')
        .call((s) => legendRender(s))
        // .on('pointerover.chartlinehighlight pointerout.chartlinehighlight', (e) => { //TODO: Hover
        //   chartLineHoverLegendItem(
        //     drawAreaS,
        //     select(e.target.closest('.legend-item')),
        //     e.type.endsWith('over')
        //   );
        // });


      chartD.xAxis.scale = chartD.xScale;
      chartD.yAxis.scale = chartD.yScale;
    })
    .call((s) => chartCartesianAxesRender(s));
}
