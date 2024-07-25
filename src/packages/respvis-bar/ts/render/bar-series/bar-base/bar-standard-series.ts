import {BarSeriesType, Rect} from "respvis-core";
import {BarBaseSeries} from "./bar-base-series";
import {
  BarBaseSeriesArgs,
  BarBaseSeriesData,
  BarBaseSeriesUserArgs,
  validateBarBaseSeriesArgs
} from "./validate-bar-base-series";
import {cloneCartesianSeriesData} from "respvis-cartesian";

export type BarStandardSeriesUserArgs = BarBaseSeriesUserArgs & {
  type?: 'standard'
}

export type BarStandardSeriesArgs = BarBaseSeriesArgs & BarStandardSeriesUserArgs

export class BarStandardSeries extends BarBaseSeries {
  type: BarSeriesType
  originalData: BarBaseSeriesData
  renderData: BarBaseSeriesData
  constructor(args: BarStandardSeriesArgs) {
    super(args);
    this.originalData = validateBarBaseSeriesArgs(args, this)
    this.renderData = this.originalData
    this.type = args.type ?? 'standard'
  }

  getRect(i: number): Rect {
    return this.responsiveState.getBarBaseRect(i)
  }

  cloneToRenderData(): BarStandardSeries {
    this.renderData = cloneCartesianSeriesData(this.originalData)
    return this
  }

  applyZoom(): BarStandardSeries {
    super.applyZoom()
    return this
  }

  applyFilter(): BarStandardSeries {
    super.applyFilter()
    return this
  }

  applyInversion(): BarStandardSeries {
    throw new Error("Method not implemented.");
  }
}
