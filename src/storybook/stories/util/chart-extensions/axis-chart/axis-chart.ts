import {axisLayoutRender, AxisValid, Chart, rectFromString, WindowValid} from "../../../../../ts";
import {Selection} from "d3";
import {AxisChartUserArgs, AxisChartValid, axisChartValidation} from "./axis-chart-validation";

type WindowSelection = Selection<HTMLDivElement, WindowValid & AxisChartValid>
type ChartSelection = Selection<SVGSVGElement, WindowValid & AxisChartValid>

export class AxisChart extends Chart {
  constructor(s: Selection<HTMLDivElement>, args: AxisChartUserArgs ) {
    super(s, {...args, type: 'cartesian'})
    const chartData = axisChartValidation({...args, renderer: this})
    this._windowS = s as WindowSelection
    const initialWindowData = this.windowS.datum()
    this.windowS.datum({...initialWindowData, ...chartData})
  }
  _windowS: WindowSelection
  get windowS(): WindowSelection { return this._windowS }
  _chartS?: ChartSelection
  get chartS(): ChartSelection {
    return ((this._chartS && !this._chartS.empty()) ? this._chartS :
      this.layouterS.selectAll('svg.chart')) as ChartSelection
  }

  protected mainRender() {
    super.mainRender()
    const {width, height} = rectFromString(this.drawAreaS.attr('bounds') || '0, 0, 600, 400')
    const axes = this.chartS.datum().axes

    this.chartS.classed('chart-cartesian', true)

    axes.forEach(axis => {
      if (axis.standardOrientation === 'horizontal') axis.scaledValues.scale.range([0, width])
      else axis.scaledValues.scale.range([height, 0])
      const layout = axis.standardOrientation === 'horizontal' ? axis.horizontalLayout : axis.verticalLayout
      this.paddingWrapperS.selectAll<SVGGElement, AxisValid>(`.axis.axis-${layout}`)
        .data([axis])
        .join('g')
        .call(s => axisLayoutRender(s, axis.standardOrientation))
    })
  }
}
