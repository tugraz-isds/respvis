import {Selection} from "d3";
import {chartWindowRender, ChartWindowValid, layouterCompute} from "../../core";
import {Chart} from "../../core/render/charts/chart";
import {ParcoordChartUserArgs, ParcoordChartValid, parcoordChartValidation} from "./parcoord-chart-validation";
import {parCoordChartRender} from "./parcoord-chart-render";

export type ParcoordChartSelection = Selection<HTMLDivElement, ChartWindowValid & ParcoordChartValid> // & LineChartValid

export class ParcoordChart extends Chart {
  windowSelection: ParcoordChartSelection

  constructor(windowSelection: Selection<HTMLDivElement>, data: ParcoordChartUserArgs) {
    super({...data, type: 'parcoord'})
    this.windowSelection = windowSelection as ParcoordChartSelection
    const chartData = parcoordChartValidation({...data, renderer: this})
    this.windowSelection.datum({...this.initialWindowData, ...chartData})
  }

  protected addBuiltInListeners() {
    // throw new Error("Method not implemented.");
  }

  protected render(): void {
    const {
      chartS,
      layouterS
    } = chartWindowRender(this.windowSelection)
    // toolbarRender(this.windowSelection)
    parCoordChartRender(chartS)
    const boundsChanged = layouterCompute(layouterS)
    // if (boundsChanged) this.render()
  }
}
