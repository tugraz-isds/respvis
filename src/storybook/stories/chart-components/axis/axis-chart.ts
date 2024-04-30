import {
  axisBottomRender,
  axisLeftRender,
  axisRightRender,
  axisTopRender,
  AxisValid,
  baseAxisValidation,
  Chart,
  PointSeries,
  rectFromString
} from "../../../../lib";

export class AxisChart extends Chart {
  scaledValuesArgs = {values: [20, 30, 40, 50, 60, 70]}
  series = new PointSeries({
    x: this.scaledValuesArgs,
    y: this.scaledValuesArgs,
    key: 's-0',
    renderer: this
  })
  axisXD = baseAxisValidation({
    series: this.series,
    scaledValues: this.series.x,
    renderer: this
  })
  axisYD = baseAxisValidation({
    series: this.series,
    scaledValues: this.series.y,
    renderer: this
  })

  protected mainRender() {
    super.mainRender()
    const {width, height} = rectFromString(this.drawAreaS.attr('bounds') || '0, 0, 600, 400')
    this.series.x.scale.range([0, width])
    this.series.y.scale.range([height, 0])

    this.chartS.classed('chart-cartesian', true)

    const axisBottomS = this.paddingWrapperS.selectAll<SVGGElement, AxisValid>('.axis.axis-bottom')
      .data([this.axisXD])
      .join('g')
      .call(axisBottomRender)
    const axisTopS = this.paddingWrapperS.selectAll<SVGGElement, AxisValid>('.axis.axis-top')
      .data([this.axisXD])
      .join('g')
      .call(axisTopRender)
    const axisLeftS = this.paddingWrapperS.selectAll<SVGGElement, AxisValid>('.axis.axis-left')
      .data([this.axisYD])
      .join('g')
      .call(axisLeftRender)
    const axisRightS = this.paddingWrapperS.selectAll<SVGGElement, AxisValid>('.axis.axis-right')
      .data([this.axisYD])
      .join('g')
      .call(axisRightRender)
  }
}
