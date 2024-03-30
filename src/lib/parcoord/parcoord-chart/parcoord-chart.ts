import {Selection} from "d3";
import {WindowValid} from "../../core";
import {ParcoordChartUserArgs, ParcoordChartValid, parcoordChartValidation} from "./parcoord-chart-validation";
import {parCoordChartRender} from "./parcord-chart-render/parcoord-chart-render";
import {SeriesChart} from "../../core/render/chart/series-chart/series-chart";

type WindowSelection = Selection<HTMLDivElement, WindowValid & ParcoordChartValid>
type ChartSelection = Selection<SVGSVGElement, WindowValid & ParcoordChartValid>

export class ParcoordChart extends SeriesChart {
  windowS: WindowSelection

  constructor(windowSelection: Selection<HTMLDivElement>, data: ParcoordChartUserArgs) {
    super({...data, type: 'parcoord'})
    this.windowS = windowSelection as WindowSelection
    const chartData = parcoordChartValidation({...data, renderer: this})
    this.windowS.datum({...this.initialWindowData, ...chartData})
  }

  get chartS(): ChartSelection {
    return ((this._chartS && !this._chartS.empty()) ? this._chartS :
      this.layouterS.selectAll('svg.chart')) as ChartSelection
  }

  protected mainRender(): void {
    super.mainRender()
    parCoordChartRender(this.chartS!)
  }
}
