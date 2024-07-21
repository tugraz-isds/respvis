import {CartesianResponsiveState, CartesianResponsiveStateArgs} from "respvis-cartesian";
import {BarBaseSeries} from "./bar-base-series";
import {Rect, ScaledValuesCategorical, ScaledValuesNumeric} from "respvis-core";

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

  getBarBaseRect(i: number): Rect {
    return this.currentlyFlipped ?
      this.getBarRectHorizontal(i, this.horizontalVals() as ScaledValuesNumeric, this.verticalVals() as ScaledValuesCategorical) :
      this.getBarRectVertical(i, this.verticalVals() as ScaledValuesNumeric, this.horizontalVals() as ScaledValuesCategorical)
  }

  private getBarRectVertical(i: number, linearVals: ScaledValuesNumeric, categoryVals: ScaledValuesCategorical) {
    return {
      x: barRectFormula.barCategoryStart(categoryVals, i),
      y: barRectFormula.barLinearStart(linearVals, i),
      width: barRectFormula.barCategoryLength(categoryVals, i),
      height: barRectFormula.barLinearLength(linearVals, i),
    }
  }

  private getBarRectHorizontal(i: number, linearVals: ScaledValuesNumeric, categoryVals: ScaledValuesCategorical) {
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
  barLinearStart: (vals: ScaledValuesNumeric, i: number) => Math.min(vals.getScaledValueEnd(i), vals.scale(0)!),
  barLinearLength: (vals: ScaledValuesNumeric, i: number) => Math.abs(vals.scale(0)! - vals.getScaledValue(i)),
} as const
