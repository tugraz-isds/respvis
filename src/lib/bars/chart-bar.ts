import { BaseType, select, Selection } from 'd3-selection';
import { debug, nodeToString } from '../core';
import {
  chartCartesian,
  chartCartesianUpdateAxes,
  dataChartCartesian,
  DataChartCartesian,
} from '../core/chart-cartesian';
import { seriesBar, dataSeriesBar, DataSeriesBar } from './series-bar';
import { seriesLabel } from './series-label';
import { dataSeriesLabelBar } from './series-label-bar';

export interface DataChartBar extends DataSeriesBar, DataChartCartesian {}

export function dataChartBar(data: Partial<DataChartBar>): DataChartBar {
  return {
    ...dataSeriesBar(data),
    ...dataChartCartesian(data),
  };
}

export function chartBar<
  GElement extends SVGSVGElement | SVGGElement,
  Datum extends DataChartBar,
  PElement extends BaseType,
  PDatum
>(
  selection: Selection<GElement, Datum, PElement, PDatum>
): Selection<GElement, Datum, PElement, PDatum> {
  return selection
    .call((s) => chartCartesian(s, false))
    .classed('chart-bar', true)
    .each((chartData, i, g) => {
      const drawArea = select<GElement, Datum>(g[i]).selectAll('.draw-area');

      const barSeries = drawArea
        .append('g')
        .layout('grid-area', '1 / 1')
        .datum<DataSeriesBar>(chartData)
        .call((s) => seriesBar(s));

      drawArea
        .append('g')
        .layout('grid-area', '1 / 1')
        .datum(dataSeriesLabelBar({ barContainer: barSeries }))
        .call((s) => seriesLabel(s));
    })
    .on('datachange.debuglog', function () {
      debug(`data change on ${nodeToString(this)}`);
    })
    .on('datachange.chartbar', function (e, chartData) {
      chartBarDataChange(select<GElement, Datum>(this));
    })
    .call((s) => chartBarDataChange(s));
}

export function chartBarDataChange<
  GElement extends SVGSVGElement | SVGGElement,
  Datum extends DataChartBar,
  PElement extends BaseType,
  PDatum
>(
  selection: Selection<GElement, Datum, PElement, PDatum>
): Selection<GElement, Datum, PElement, PDatum> {
  return selection.each(function (chartData, i, g) {
    const s = select<GElement, Datum>(g[i]);

    s.selectAll('.series-bar').dispatch('datachange');

    chartData.mainAxis.scale = chartData.mainScale;
    chartData.crossAxis.scale = chartData.crossScale;

    chartCartesianUpdateAxes(s);
  });
}
