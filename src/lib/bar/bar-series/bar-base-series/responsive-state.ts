import {
  CartesianSeriesResponsiveState,
  CartesianSeriesResponsiveStateArgs
} from "../../../core/render/series/cartesian-series/responsive-state";
import {BarBaseSeries} from "../bar-base-series";
import {ScaledValues} from "../../../core/data/scale/scaled-values-base";
import {ScaledValuesCategorical} from "../../../core/data/scale/scaled-values-categorical";

type BarBaseResponsiveStateArgs = CartesianSeriesResponsiveStateArgs & {
  series: BarBaseSeries
  originalSeries: BarBaseSeries
}

export class BarBaseResponsiveState extends CartesianSeriesResponsiveState {
  protected _series: BarBaseSeries
  protected _originalSeries: BarBaseSeries

  constructor(args: BarBaseResponsiveStateArgs) {
    super(args)
    this._series = args.series
    this._originalSeries = args.originalSeries
  }

  update() {
    super.update();
  }

  getBarRect(i: number) {
    const barOrientation = this.currentlyFlipped ? 'horizontal' : 'vertical'
    return {
      x: barRectFormula[barOrientation].x(this.currentXVals(), i),
      y: barRectFormula[barOrientation].y(this.currentYVals(), i),
      width: barRectFormula[barOrientation].width(this.currentXVals() as ScaledValuesCategorical, i),
      height: barRectFormula[barOrientation].height(this.currentYVals() as ScaledValuesCategorical, i),
    }
  }

  cloneProps(): BarBaseResponsiveStateArgs {
    const originalSeries = this._originalSeries
    return { ...super.cloneProps(), series: this._series, originalSeries }
  }

  clone(args?: Partial<BarBaseResponsiveStateArgs>) {
    return new BarBaseResponsiveState({...this.cloneProps(), ...(args ? args : {})})
  }
}

const barRectFormula = {
  horizontal: {
    x: (vals: ScaledValues, i: number) => vals.scale.range()[0],
    y: (vals: ScaledValues, i: number) => vals.getScaledValueStart(i),
    width: (vals: ScaledValues, i: number) => vals.getScaledValue(i),
    height: (vals: ScaledValuesCategorical, i: number) => vals.scale.bandwidth()
  },
  vertical: {
    x: (vals: ScaledValues, i: number) => vals.getScaledValueStart(i),
    y: (vals: ScaledValues, i: number) => vals.getScaledValueEnd(i),
    width: (vals: ScaledValuesCategorical, i: number) => vals.scale.bandwidth(),
    height: (vals: ScaledValues, i: number) => Math.abs(vals.scale.range()[0]! - vals.getScaledValue(i))
  }
} as const
