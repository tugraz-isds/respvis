import {CartesianResponsiveState, CartesianResponsiveStateArgs} from "respvis-cartesian";
import {PointSeries} from "respvis-point";
import {BubbleRadius, Circle, elementFromSelection} from "respvis-core";
import {RespValInterpolated} from "respvis-core/data/responsive-value/responsive-value-interpolated";

type PointResponsiveStateArgs = CartesianResponsiveStateArgs & {
  series: PointSeries
  originalSeries: PointSeries
}

export class PointResponsiveState extends CartesianResponsiveState {
  protected _series: PointSeries
  protected _originalSeries: PointSeries

  constructor(args: PointResponsiveStateArgs) {
    super(args)
    this._series = args.series
    this._originalSeries = args.originalSeries
  }

  update() {
    super.update();

    const radii = this._originalSeries.radii
    const chart = this._series.renderer.chartS

    if (radii instanceof RespValInterpolated || typeof radii === 'number') return

    interpolateBubbleRadius(radii)

    function interpolateBubbleRadius(radii: BubbleRadius) {
      if (!(radii.extrema instanceof RespValInterpolated)) {
        radii.scale.range([radii.extrema.minimum, radii.extrema.maximum]); return
      }

      let {preBreakpoint, postBreakpoint,
      firstBreakpoint, lastBreakpoint} =
        radii.extrema.getRespValInterpolated({chart})

      if (postBreakpoint === null) {
        radii.scale.range([lastBreakpoint.value.minimum, lastBreakpoint.value.maximum]); return
      }
      if (preBreakpoint === null) {
        preBreakpoint = firstBreakpoint
        preBreakpoint.length = 0
      }

      const elementLength = elementFromSelection(chart).getBoundingClientRect()[radii.extrema.dependentOn]
      const breakpointDiff = postBreakpoint.length - preBreakpoint.length
      const currentDiff = elementLength - preBreakpoint.length
      const minimumDiff = postBreakpoint.value.minimum - preBreakpoint.value.minimum
      const maximumDiff = postBreakpoint.value.maximum - preBreakpoint.value.maximum

      const minimum = preBreakpoint.value.minimum + currentDiff / breakpointDiff * minimumDiff
      const maximum = preBreakpoint.value.maximum + currentDiff / breakpointDiff * maximumDiff
      radii.scale.range([minimum, maximum])
    }
  }

  getRadius(i: number): number {
    const radii = this._originalSeries.radii
    if (typeof radii === 'number') return radii
    if (radii instanceof RespValInterpolated) {
      //TODO: FINISH THIS!
      return 5 //getCurrentRespVal(radii, {chart})
    }
    return radii.scale(radii.values[i])
  }

  getRadiusValue(i: number) {
    const radii = this._series.radii
    return typeof radii === 'number' ? radii :
      radii instanceof RespValInterpolated ? undefined :
        radii.values[i]
  }

  getPointCircle(i: number): Circle {
    return {
      center: {
        x: this.horizontalVals().getScaledValue(i),
        y: this.verticalVals().getScaledValue(i),
      },
      radius: this.getRadius(i) ?? 5
    }
  }

  cloneProps(): PointResponsiveStateArgs {
    const originalSeries = this._originalSeries
    return { ...super.cloneProps(), series: this._series, originalSeries }
  }

  clone(args?: Partial<PointResponsiveStateArgs>) {
    return new PointResponsiveState({...this.cloneProps(), ...(args ? args : {})})
  }
}
