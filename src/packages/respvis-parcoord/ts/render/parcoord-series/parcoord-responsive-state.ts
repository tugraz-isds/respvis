import {AxisLayout, ResponsiveState, ResponsiveStateArgs} from "respvis-core";
import {ZoomTransform} from "d3";
import {ParcoordSeries} from "./parcoord-series";

type ParcoordResponsiveStateArgs = ResponsiveStateArgs & {
  series: ParcoordSeries
}

export class ParcoordResponsiveState extends ResponsiveState {
  protected _series: ParcoordSeries
  protected _axisLayout: AxisLayout

  constructor(args: ParcoordResponsiveStateArgs) {
    super(args);
    this._series = args.series
    this._axisLayout = this.currentlyFlipped ? 'bottom' : 'left'
  }

  get axisLayout() {
    return this._axisLayout
  }

  getAxisPosition(key: string) {
    const {axesPercentageScale, percentageScreenScale} = this._series.renderData
    const percentage = axesPercentageScale(key) ?? 0
    return this.currentlyFlipped ? {x: 0, y: percentageScreenScale(percentage)} : {
      x: percentageScreenScale(percentage),
      y: 0
    }
  }

  update() {
    this.updateZoomOnFlip()
    super.update()
    this.updateScales()
  }

  private updateScales() {
    const {horizontal, vertical} = this.drawAreaRange()
    const currentAxesSpaceRange = this.currentlyFlipped ? vertical : horizontal

    this._axisLayout = this.currentlyFlipped ? 'bottom' : 'left'
    const orientation = this.currentlyFlipped ? 'horizontal' : 'vertical'

    const {axes, axesScale, percentageScreenScale} = this._series.originalData
    axes.forEach(axis => axis.scaledValues.updateRange(horizontal, vertical, orientation))
    percentageScreenScale.range(currentAxesSpaceRange)
    axesScale.range(currentAxesSpaceRange)
  }

  private updateZoomOnFlip() {
    if (this._previouslyFlipped === this._currentlyFlipped) return

    this._series.originalData.zooms.forEach((zoom) => {
      if (!zoom?.currentTransform || zoom.currentTransform.k === 1) return
      // const t = zoom.currentTransform
      // reset zoom on flipping. TODO: Desired would be a rescaling from x to y and vice versa
      zoom.currentTransform = new ZoomTransform(1, 0, 0)
    })
  }
}
