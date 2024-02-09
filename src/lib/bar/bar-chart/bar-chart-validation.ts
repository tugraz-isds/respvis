import {Selection} from 'd3';
import {CartesianChartUserArgs, CartesianChartValid, cartesianChartValidation} from "../../core";
import {BarSeries, SeriesBarUserArgs} from "../bar-series/bar-series-validation";
import {Bar} from "../bar-series/bar";

export type BarChartArgs = CartesianChartUserArgs & {
  series: SeriesBarUserArgs
}

export type BarChartValid = CartesianChartValid & {
  series: BarSeries
}

export function barChartValidation(chartArgs: BarChartArgs): BarChartValid {
  const {renderer, x, y, zoom,
    legend, bounds,
    title, subTitle
  } = chartArgs
  const series = new BarSeries({...chartArgs.series, key: 's-0', renderer})
  const cartesianData =
    cartesianChartValidation({renderer, series, x, y, zoom, legend, bounds, title, subTitle})
  return {
    ...cartesianData,
    series
  }
}

export type ChartBarSelection = Selection<SVGSVGElement | SVGGElement, BarChartValid>;

export function chartBarHoverBar(chart: Selection, bar: Selection<Element, Bar>, hover: boolean) {
  bar.each((barD) => {
    chart.selectAll(`.label[data-key="${barD.key}"]`).classed('highlight', hover);
  });
}
