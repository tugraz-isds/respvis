import {CartesianResponsiveState, CartesianResponsiveStateArgs} from "respvis-cartesian";
import {PointSeries} from "./point-series";
import {BubbleRadius} from "../../data/radius";
import {BreakpointProperty, Circle, elementFromSelection} from "respvis-core";

type PointResponsiveStateArgs = CartesianResponsiveStateArgs & {
  series: PointSeries
}

export class PointResponsiveState extends CartesianResponsiveState {
  protected _series: PointSeries

  constructor(args: PointResponsiveStateArgs) {
    super(args)
    this._series = args.series
  }

  update() {
    super.update();

    const radii = this._series.originalData.radii
    const chart = this._series.renderer.chartS


    updateRadii()

    chart.style('--max-radius', this.getMaxRadius() + 'px')

    function updateRadii() {
      if (typeof radii === 'number') return
      if (radii instanceof BreakpointProperty) {
        return
      }
      interpolateBubbleRadius(radii)
    }

    function interpolateBubbleRadius(radii: BubbleRadius) {
      if (!(radii.extrema instanceof BreakpointProperty)) {
        radii.scale.range([radii.extrema.minimum, radii.extrema.maximum]); return
      }

      let {preBreakpoint, postBreakpoint,
      firstBreakpoint, lastBreakpoint} =
        radii.extrema.getRespValInterpolated({chart})

      if (postBreakpoint === null) {
        radii.scale.range([lastBreakpoint.value.minimum, lastBreakpoint.value.maximum]); return
      }
      if (preBreakpoint === null) {
        radii.scale.range([firstBreakpoint.value.minimum, firstBreakpoint.value.maximum]); return
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
    const radii = this._series.originalData.radii
    const chart = this._series.renderer.chartS
    if (typeof radii === 'number') return radii
    if (radii instanceof BreakpointProperty) {
      return interpolateInterpolatedRadius(radii)
    }
    return radii.scale(radii.values[i])

    function interpolateInterpolatedRadius(radii: BreakpointProperty<number>) {
      let {preBreakpoint, postBreakpoint,
        firstBreakpoint, lastBreakpoint} =
        radii.getRespValInterpolated({chart})

      if (postBreakpoint === null) {
        return lastBreakpoint.value
      }
      if (preBreakpoint === null) {
        preBreakpoint = firstBreakpoint
        preBreakpoint.length = 0
      }

      const elementLength = elementFromSelection(chart).getBoundingClientRect()[radii.dependentOn]
      const breakpointLengthDiff = postBreakpoint.length - preBreakpoint.length
      const currentLengthDiff = elementLength - preBreakpoint.length
      const valueDiff = postBreakpoint.value - preBreakpoint.value

      return preBreakpoint.value + currentLengthDiff / breakpointLengthDiff * valueDiff
    }
  }

  getMaxRadius() {
    const radii = this._series.originalData.radii
    return (typeof radii === 'number') ? radii :
      radii instanceof BreakpointProperty ? this.getRadius(0) :
        Math.max(...radii.scale.range())
  }

  getRadiusValue(i: number) {
    const radii = this._series.renderData.radii
    return typeof radii === 'number' ? radii :
      radii instanceof BreakpointProperty ? undefined :
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
    return { ...super.cloneProps(), series: this._series }
  }

  clone(args?: Partial<PointResponsiveStateArgs>) {
    return new PointResponsiveState({...this.cloneProps(), ...(args ? args : {})})
  }
}
