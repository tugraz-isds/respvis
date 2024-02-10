import {selectAll, Selection, zoom, ZoomTransform} from "d3";
import {rectFromString, WindowValid} from "../../core";
import {ParcoordChartUserArgs, ParcoordChartValid, parcoordChartValidation} from "./parcoord-chart-validation";
import {parCoordChartRender} from "./parcoord-chart-render";
import {elementFromSelection, throttle} from "../../core/utilities/d3/util";
import {getCurrentRespVal} from "../../core/data/responsive-value/responsive-value";
import {SeriesChart} from "../../core/render/chart/series-chart/series-chart";

type WindowSelection = Selection<HTMLDivElement, WindowValid & ParcoordChartValid>
type ChartSelection = Selection<SVGSVGElement, WindowValid & ParcoordChartValid>

const zoomB = zoom()


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
  public newData: any

  private addZoomListeners() {
    const renderer = this
    const chartWindowD = this.windowSelection.datum()
    // if (!chartWindowD.zoom) return
    const drawAreaS = selectAll('.draw-area')

    const onZoom = function (e, i: number) {
      console.log('ZOOM!')
      //TODO: Save original scales and return rescaled copies of them (the only way it works with d3 scales)
      const transform: ZoomTransform = e.transform
      const chartData = renderer.windowSelection.datum()
      const seriesUpdated = chartData.series.clone()

      console.log(seriesUpdated.axes[i].scaledValues)
      seriesUpdated.axes[i].scaledValues = seriesUpdated.axes[i].scaledValues.cloneZoomed(transform, 'y')
      renderer.windowSelection.data([{...chartData,
        series: seriesUpdated,
        legend: {...chartData.legend, series: seriesUpdated}
      }])
      renderer.windowSelection.dispatch('resize')
    }
    const throttledZoom = throttle((e, i: number) => onZoom(e, i), 50)

    const axisSequenceS = this.windowSelection.selectAll('.axis.axis-sequence')
    console.log(axisSequenceS)
    axisSequenceS.each((d, i, g) => {
      if (i === 2) { //select(g[i])
        drawAreaS.call(
          zoomB.scaleExtent([1, 20]).on('zoom.autozoom', (e) => throttledZoom(e, i))
        )
      }
    })

    this.windowSelection.on('resize.autozoom', () => {
      const [x1, widthTranslate] = chartWindowD.series.axesScale.range()
      const [y1, heightTranslate] = chartWindowD.getAxes()[2].scaledValues.scale.range()
      const extent: [[number, number], [number, number]] = [
        [x1, widthTranslate],
        [y1, heightTranslate],
      ]
      zoomB.extent(extent).translateExtent(extent);
    });
  }

  protected mainRender(): void {
    super.mainRender()
    parCoordChartRender(this.chartSelection!)
  }

  protected preRender() {
    if (!this.initialRenderHappened) return

    const drawArea = this.windowSelection.selectAll('.draw-area')
    const {series} = this.windowSelection.datum()
    const {axes, axesScale} = series
    const {width, height} = rectFromString(drawArea.attr('bounds') || '0, 0, 600, 400')
    const chartElement = elementFromSelection(this.chartSelection)

    const renderState = { width, height,
      flipped: getCurrentRespVal(series.flipped, {chart: chartElement}),
      originalXRange: function (){
        return this.flipped ? [this.height, 0] : [0, this.width]
      },
      originalYRange: function (){
        return this.flipped ? [0, this.width] : [this.height, 0]
      }
    }

    axes.forEach(axis => axis.scaledValues.scale.range(renderState.originalYRange()))
    axesScale.range(renderState.originalXRange())
  }
}
