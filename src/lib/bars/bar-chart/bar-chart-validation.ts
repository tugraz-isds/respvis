import {Selection} from 'd3';
import {ChartCartesianUserArgs, ChartCartesianValid, chartCartesianValidation} from "../../core";
import {Bar, SeriesBarUserArgs, SeriesBarValid, seriesBarValidation} from "../bar-series/bar-series-validation";

export type BarChartArgs = ChartCartesianUserArgs & {
  series: SeriesBarUserArgs
}

export type BarChartValid = ChartCartesianValid & {
  series: SeriesBarValid
}

export function barChartValidation(chartArgs: BarChartArgs): BarChartValid {
  const {renderer, x, y, zoom,
    legend, bounds,
    title, subTitle
  } = chartArgs
  const series = seriesBarValidation({...chartArgs.series, key: 's-0', renderer})
  const cartesianData =
    chartCartesianValidation({renderer, series, x, y, zoom, legend, bounds, title, subTitle})
  return {
    ...cartesianData,
    series
  }
}

export type ChartBarSelection = Selection<SVGSVGElement | SVGGElement, BarChartValid>;

export function chartBarHoverBar(chart: Selection, bar: Selection<Element, Bar>, hover: boolean) {
  bar.each((barD) => {
    chart.selectAll(`.label[data-key="${barD.key}"]`).classed('highlight', hover);
    chart.selectAll(`.axis-x .tick[data-key="${barD.category}"]`).classed('highlight', hover);
  });
}
