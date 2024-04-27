import {Selection} from "d3";
import {Chart, WindowValid} from "../../core";
import {ParcoordChartUserArgs, ParcoordChartValid, parcoordChartValidation} from "./parcoord-chart-validation";
import {parCoordChartRender} from "./parcord-chart-render/parcoord-chart-render";
import {SeriesChartMixin} from "../../core/render/chart/series-chart/series-chart-mixin";
import {applyMixins} from "../../core/utilities/typescript";

type WindowSelection = Selection<HTMLDivElement, WindowValid & ParcoordChartValid>
type ChartSelection = Selection<SVGSVGElement, WindowValid & ParcoordChartValid>

export interface ParcoordChart extends SeriesChartMixin {}
export class ParcoordChart extends Chart {
  constructor(windowSelection: Selection<HTMLDivElement>, data: ParcoordChartUserArgs) {
    super(windowSelection, {...data, type: 'parcoord'})
    this._windowS = windowSelection as WindowSelection
    const initialWindowData = this.windowS.datum()
    const chartData = parcoordChartValidation({...data, renderer: this})
    this.windowS.datum({...initialWindowData, ...chartData})
  }

  _windowS: WindowSelection
  get windowS(): WindowSelection { return this._windowS }
  get chartS(): ChartSelection {
    return ((this._chartS && !this._chartS.empty()) ? this._chartS :
      this.layouterS.selectAll('svg.chart')) as ChartSelection
  }

  protected mainRender(): void {
    super.mainRender()
    this.seriesRequirementsRender()
    parCoordChartRender(this.chartS!)
    this.addFilterListener()
  }
}

applyMixins(ParcoordChart, [SeriesChartMixin])

