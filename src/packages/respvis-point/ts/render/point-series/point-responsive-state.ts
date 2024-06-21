import {CartesianResponsiveState, CartesianResponsiveStateArgs} from "respvis-cartesian";
import {PointSeries} from "respvis-point";
import {BubbleRadius, Circle, elementFromSelection, ErrorMessages} from "respvis-core";
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

      const {
        preBreakpointIndex,
        preBreakpointValue,
        preBreakPointLength,
        postBreakpointIndex,
        postBreakpointValue,
        postBreakPointLength } = radii.extrema.getRespValInterpolated({chart})

      if (preBreakpointValue === null && postBreakpointValue !== null) {
        radii.scale.range([postBreakpointValue.minimum, postBreakpointValue.maximum]); return
      } else if (preBreakpointValue !== null && postBreakpointValue === null) {
        radii.scale.range([preBreakpointValue.minimum, preBreakpointValue.maximum]); return
      }

      if (preBreakpointValue === null || postBreakpointValue === null
      || preBreakpointIndex === null || postBreakpointIndex === null) throw new Error(ErrorMessages.defaultError)

      const elementLength = elementFromSelection(chart).getBoundingClientRect()[radii.extrema.dependentOn]


      const breakpointDiff = postBreakPointLength - preBreakPointLength
      const currentDiff = elementLength - preBreakpointIndex
      const minimumDiff = postBreakpointValue.minimum - preBreakpointValue.minimum
      const maximumDiff = postBreakpointValue.maximum - preBreakpointValue.maximum

      const minimum = preBreakpointValue.minimum + currentDiff / breakpointDiff * minimumDiff
      const maximum = preBreakpointValue.maximum + currentDiff / breakpointDiff * maximumDiff

      // console.log('START')
      // console.log("preBreakpointIndex", preBreakpointIndex)
      // console.log("preBreakPointLength", preBreakPointLength)
      // console.log("preBreakpointValue", preBreakpointValue)
      // console.log("postBreakpointIndex", postBreakpointIndex)
      // console.log("postBreakPointLength", postBreakPointLength)
      // console.log("postBreakpointValue", postBreakpointValue)
      // console.log("preBreakpointValue.minimum", preBreakpointValue.minimum)
      // console.log("minimumDiff", minimumDiff)
      // console.log("minimum", minimum)

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
