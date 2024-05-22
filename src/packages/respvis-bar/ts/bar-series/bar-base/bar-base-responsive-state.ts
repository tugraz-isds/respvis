import {CartesianResponsiveState, CartesianResponsiveStateArgs} from "respvis-cartesian";
import {BarBaseSeries} from "./bar-base-series";
import {ScaledValuesCategorical, ScaledValuesLinear} from "respvis-core";

type BarBaseResponsiveStateArgs = CartesianResponsiveStateArgs & {
  series: BarBaseSeries
  originalSeries: BarBaseSeries
}

export class BarBaseResponsiveState extends CartesianResponsiveState {
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
    return this.currentlyFlipped ?
      this.getBarRectHorizontal(i, this.currentXVals() as ScaledValuesLinear, this.currentYVals() as ScaledValuesCategorical) :
      this.getBarRectVertical(i, this.currentYVals() as ScaledValuesLinear, this.currentXVals() as ScaledValuesCategorical)
  }

  getBarRectVertical(i: number, linearVals: ScaledValuesLinear, categoryVals: ScaledValuesCategorical) {
    return {
      x: barRectFormula.barCategoryStart(categoryVals, i),
      y: barRectFormula.barLinearStart(linearVals, i),
      width: barRectFormula.barCategoryLength(categoryVals, i),
      height: barRectFormula.barLinearLength(linearVals, i),
    }
  }

  getBarRectHorizontal(i: number, linearVals: ScaledValuesLinear, categoryVals: ScaledValuesCategorical) {
    return {
      x: barRectFormula.barLinearStart(linearVals, i),
      y: barRectFormula.barCategoryStart(categoryVals, i),
      width: barRectFormula.barLinearLength(linearVals, i),
      height: barRectFormula.barCategoryLength(categoryVals, i),
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
  barCategoryStart: (vals: ScaledValuesCategorical, i: number) => vals.getScaledValueStart(i),
  barCategoryLength: (vals: ScaledValuesCategorical, _: number) => vals.scale.bandwidth(),
  barLinearStart: (vals: ScaledValuesLinear, i: number) => Math.min(vals.getScaledValueEnd(i), vals.scale(0)!),
  barLinearLength: (vals: ScaledValuesLinear, i: number) => Math.abs(vals.scale(0)! - vals.getScaledValue(i)),
} as const
