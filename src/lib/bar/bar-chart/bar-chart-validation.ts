import {Selection} from 'd3';
import {CartesianChartUserArgs, CartesianChartValid, cartesianChartValidation} from "../../cartesian";
import {BarSeries, BarSeriesUserArgs} from "../bar-series/bar-series";
import {BarArgs} from "../bar";
import {BarStackedSeries} from "../bar-series/bar-stacked-series";
import {BarGroupedSeries} from "../bar-series/bar-grouped-series";
import {BarStandardSeries} from "../bar-series";

export type BarChartArgs = CartesianChartUserArgs & {
  series: BarSeriesUserArgs
}

export type BarChartValid = CartesianChartValid & {
  series: BarSeries
}

export function barChartValidation(chartArgs: BarChartArgs): BarChartValid {
  const {renderer, x, y,
    legend, breakPoints,
    title, subTitle
  } = chartArgs
  const series = chartArgs.series.type === 'stacked' ?
    new BarStackedSeries({...chartArgs.series, key: 's-0', renderer}) : chartArgs.series.type === 'grouped' ?
    new BarGroupedSeries({...chartArgs.series, key: 's-0', renderer}) :
    new BarStandardSeries({...chartArgs.series, key: 's-0', renderer})
  const cartesianData =
    cartesianChartValidation({renderer, series, x, y, legend, breakPoints, title, subTitle})
  return {
    ...cartesianData,
    series
  }
}

export type ChartBarSelection = Selection<SVGSVGElement | SVGGElement, BarChartValid>;

export function chartBarHoverBar(chart: Selection, bar: Selection<Element, BarArgs>, hover: boolean) {
  bar.each((barD) => {
    chart.selectAll(`.label[data-key="${barD.key}"]`).classed('highlight', hover);
  });
}
