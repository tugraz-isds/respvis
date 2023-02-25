import {select, Selection} from 'd3';
import {arrayIs, rectFromString} from '../core';
import {
  ChartCartesian,
  chartCartesianAxesRender,
  chartCartesianData,
  chartCartesianRender,
} from '../core/chart-cartesian';
import {SeriesPoint, seriesPointData, seriesPointRender} from './series-point';
import {Legend, legendData, legendRender} from "../legend";

export interface ChartPoint extends SeriesPoint, ChartCartesian {
  legend: Partial<Legend>;
}

export function chartPointData(data: Partial<ChartPoint>): ChartPoint {
  const yValues = data.yValues ?? []
  const styleClasses = data.styleClasses || yValues.map((_, i) => `categorical-${i}`);
  return {
    ...seriesPointData(data),
    legend: data.legend ?? {},
    styleClasses,
    ...chartCartesianData(data),
  };
}

export type ChartPointSelection = Selection<SVGSVGElement | SVGGElement, ChartPoint>;

export function chartPointRender(selection: ChartPointSelection): void {
  selection
    .call((s) => chartCartesianRender(s))
    .classed('chart-point', true)
    .each((chartD, i, g) => {
      const drawAreaS = select(g[i]).selectAll('.draw-area');
      const drawAreaBounds = rectFromString(drawAreaS.attr('bounds') || '0, 0, 600, 400');
      const { xScale, yScale, flipped, keys, styleClasses, xValues, yValues } = chartD;

      xScale.range(flipped ? [drawAreaBounds.height, 0] : [0, drawAreaBounds.width]);
      yScale.range(flipped ? [0, drawAreaBounds.width] : [drawAreaBounds.height, 0]);

        drawAreaS
        .selectAll<SVGSVGElement, ChartPoint>('.series-point').data<SeriesPoint>(
            keys.map((k, lineI) =>
                seriesPointData({
                    styleClasses: arrayIs(styleClasses) ? styleClasses[lineI] : styleClasses,
                    keys: yValues[lineI].map((_, markerI) => `${k}-${markerI}`),
                    xValues: xValues[lineI],
                    yValues: yValues[lineI],
                    xScale,
                    yScale,
                    flipped,
                })
        )).join('svg')
            .call((s) => seriesPointRender(s))
        // .data([chartD]) //TODO: insert categories here
        // .join('svg')
        // .call((s) => seriesPointRender(s));

      const { legend: legendD } = chartD;
      selection
        .selectAll<SVGGElement, Legend>('.legend')
        .data(
          arrayIs(styleClasses) && styleClasses.length > 1
            ? [legendData({ styleClasses, labels: keys, ...legendD, keys })]
            : []
        )
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
