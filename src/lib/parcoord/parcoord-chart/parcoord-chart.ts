import {Selection, ZoomTransform} from "d3";
import {AxisDomainRV, AxisValid, rectFromString, WindowValid} from "../../core";
import {ParcoordChartUserArgs, ParcoordChartValid, parcoordChartValidation} from "./parcoord-chart-validation";
import {parCoordChartRender, ParcoordChartSVGChartSelection} from "./parcoord-chart-render";
import {elementFromSelection, throttle} from "../../core/utilities/d3/util";
import {getCurrentRespVal} from "../../core/data/responsive-value/responsive-value";
import {SeriesChart} from "../../core/render/chart/series-chart/series-chart";
import {ScaledValuesBase} from "../../core/data/scale/scaled-values-base";
import {ZoomValid} from "../../core/data/zoom";
import {KeyedAxisValid} from "../../core/render/axis/keyed-axis-validation";

type WindowSelection = Selection<HTMLDivElement, WindowValid & ParcoordChartValid>
type ChartSelection = Selection<SVGSVGElement, WindowValid & ParcoordChartValid>

export class ParcoordChart extends SeriesChart {
  windowSelection: WindowSelection
  chartSelection?: ChartSelection

  constructor(windowSelection: Selection<HTMLDivElement>, data: ParcoordChartUserArgs) {
    super({...data, type: 'parcoord'})
    this.windowSelection = windowSelection as WindowSelection
    const chartData = parcoordChartValidation({...data, renderer: this})
    this.windowSelection.datum({...this.initialWindowData, ...chartData})
  }

  protected addBuiltInListeners() {
    super.addBuiltInListeners()
    this.addZoomListeners()
  }

  private addZoomListeners() {
    const renderer = this
    const chartS = this.chartSelection!

    addZoom(chartS, (valsZoomed, index) => {
      const chartData = renderer.windowSelection.datum()
      const seriesUpdated = chartData.series.clone()
      seriesUpdated.axes[index].scaledValues = valsZoomed
      renderer.windowSelection.data([{...chartData,
        series: seriesUpdated,
        legend: {...chartData.legend, series: seriesUpdated}
      }])

      const zoomB = seriesUpdated.zooms[index]!.behaviour
      const [y1, heightTranslate] = valsZoomed.scale.range()
      const [x1, widthTranslate] = seriesUpdated.axesScale.range()
        const extent: [[number, number], [number, number]] = [
          [x1, heightTranslate],
          [widthTranslate, y1],
        ];
        zoomB.extent(extent).translateExtent(extent);

      renderer.windowSelection.dispatch('resize')
    })
  }

  protected mainRender(): void {
    super.mainRender()
    parCoordChartRender(this.chartSelection!)
  }

  protected preRender() {
    if (!this.initialRenderHappened) return

    const drawArea = this.windowSelection.selectAll('.draw-area')
    const {series} = this.windowSelection.datum()
    const {axes, axesScale, percentageScreenScale} = series
    const {width, height} = rectFromString(drawArea.attr('bounds') || '0, 0, 600, 400')
    const chartElement = elementFromSelection(this.chartSelection)

    const renderState = { width, height,
      flipped: getCurrentRespVal(series.flipped, {chart: chartElement}),
      originalXRange: function () {
        return this.flipped ? [this.height, 0] : [0, this.width]
      },
      originalYRange: function () {
        return this.flipped ? [0, this.width] : [this.height, 0]
      }
    }

    axes.forEach(axis => axis.scaledValues.scale.range(renderState.originalYRange()))
    percentageScreenScale.range(renderState.originalXRange())
    axesScale.range(renderState.originalXRange())
  }
}



function addZoom(selection: ParcoordChartSVGChartSelection,
                 callback: (valsZoomed : ScaledValuesBase<AxisDomainRV>, index: number) => void, throttleMs = 50) {
  const {series} = selection.datum()

  function updateScales(vals: ScaledValuesBase<AxisDomainRV>, zoom: ZoomValid, index: number) {
    if (!zoom) return
    const onZoom = function (e) {
      const transform: ZoomTransform = e.transform
      // const x = vals.cloneZoomed(transform, 'x')
      const valsZoomed = vals.cloneZoomed(transform, 'y')
      callback(valsZoomed, index)
    }
    const throttledZoom = throttle(onZoom, throttleMs)

    const axisS = selection.selectAll<SVGGElement, any>(`.series-parcoord-axes > g.axis.axis-sequence:nth-of-type(${index + 1})`)
    axisS.call(
      zoom.behaviour.scaleExtent([zoom.out, zoom.in]).on('zoom.autozoom', (e) => throttledZoom.func(e))
    )

  }

  series.axes.forEach((axis, index) => {
    if (!series.zooms[index]) return
    updateScales(axis.scaledValues, series.zooms[index]!, index)
  })

  const axisS = selection.selectAll<SVGGElement, AxisValid>(`.series-parcoord-axes`)
  axisS.on('enter', (e) => {
    const enteredAxisS: KeyedAxisValid = e.detail.selection.datum()
    const index = series.axes.findIndex((axis) => axis.key === enteredAxisS.key)
    if (!series.zooms[index]) return
    updateScales(series.axes[index].scaledValues, series.zooms[index]!, index)
  })
}
