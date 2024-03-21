import {BarGroupedSeries, BarGroupedSeriesUserArgs} from "./bar-grouped-series";
import {BarStackedSeries, BarStackedSeriesUserArgs} from "./bar-stacked-series";
import {BarStandardSeries, BarStandardSeriesUserArgs} from "./bar-standard-series";

export type BarSeriesUserArgs = BarStandardSeriesUserArgs | BarGroupedSeriesUserArgs | BarStackedSeriesUserArgs
export type BarSeries = BarStandardSeries | BarGroupedSeries | BarStackedSeries
