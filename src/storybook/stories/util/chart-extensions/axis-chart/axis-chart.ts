import {
  Axis,
  Chart,
  rectFromString,
  renderAxisLayout,
  renderToolbar,
  Selection,
  validateWindow,
  Window
} from "../../../../../packages";
import {AxisChartUserArgs, AxisChartValid, validateAxisChart} from "./validate-axis-chart";

type WindowSelection = Selection<HTMLDivElement, Window & AxisChartValid>
type ChartSelection = Selection<SVGSVGElement, Window & AxisChartValid>

export class AxisChart extends Chart {
  constructor(windowSelection: Selection<HTMLDivElement>, args: AxisChartUserArgs ) {
    super()
    this._windowS = windowSelection as WindowSelection
    this.revalidate(args)
  }
  _windowS: WindowSelection
  get windowS(): WindowSelection { return this._windowS }
  _chartS?: ChartSelection
  get chartS(): ChartSelection {
    return ((this._chartS && !this._chartS.empty()) ? this._chartS :
      this.layouterS.selectAll('svg.chart')) as ChartSelection
  }

  protected renderContent() {
    const {width, height} = rectFromString(this.drawAreaS.attr('bounds') || '0, 0, 600, 400')
    const {axes, series} = this.chartS.datum()
    this.chartS.classed('chart-cartesian', true)

    series.responsiveState.update()
    const flipped = series.responsiveState.currentlyFlipped

    axes.forEach((axis, index) => {
      const orientation = flipped ? (axis.standardOrientation === 'horizontal' ? 'vertical' : 'horizontal')
        : axis.standardOrientation

      if (orientation === 'horizontal') axis.scaledValues.scale.range([0, width])
      else axis.scaledValues.scale.range([height, 0])

      this.paddingWrapperS.selectAll<SVGGElement, Axis>(`.axis.axis-${index}`)
        .data([axis])
        .join('g')
        .classed(`axis-${index}`, true)
        .call(s => renderAxisLayout(s, orientation))
    })
    renderToolbar(this._windowS, {renderer: this, getAxes: () => axes, getSeries: () => [series]})
  }

  revalidate(args: AxisChartUserArgs) {
    const initialWindowData = validateWindow({...args, type: 'cartesian', renderer: this})
    const chartData = validateAxisChart({...args, renderer: this})
    this.windowS.datum({...initialWindowData, ...chartData})
  }
}
