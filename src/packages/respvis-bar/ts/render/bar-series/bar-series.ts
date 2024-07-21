import {BarGroupedSeries, BarGroupedSeriesUserArgs} from "./bar-grouped/bar-grouped-series";
import {BarStackedSeries, BarStackedSeriesUserArgs} from "./bar-stacked/bar-stacked-series";
import {BarStandardSeries, BarStandardSeriesUserArgs} from "./bar-base/bar-standard-series";

export type BarSeriesUserArgs = BarStandardSeriesUserArgs | BarGroupedSeriesUserArgs | BarStackedSeriesUserArgs
export type BarSeries = BarStandardSeries | BarGroupedSeries | BarStackedSeries
