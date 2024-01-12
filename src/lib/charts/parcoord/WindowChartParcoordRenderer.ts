import {IWindowChartBaseRenderer} from "../../core";
import { windowChartParcoordData }from "./window-chart-parcoord-data";
import {IChartParcoordArgs} from "./IChartParcoordArgs";
import {select, Selection} from "d3";
import {ChartBaseValid, layouterCompute, toolDownloadSVGRender, windowChartBaseRender} from "../../core";
import {chartParcoordRender} from "./chart-parcoord-render";
import {IChartParcoordData} from "./IChartParcoordData";

export class WindowChartParcoordRenderer implements IWindowChartBaseRenderer {
  data: IChartParcoordData;
  addedListeners = false

  constructor(public selection: Selection<HTMLDivElement, IChartParcoordData>, data: IChartParcoordArgs) {
    this.data = windowChartParcoordData(data)
  }
  addCustomListener(name: string, callback: (event: Event, data: ChartBaseValid) => void): void {
    this.selection.on(name, callback)
  }

  buildWindowChart(): void {
    this.renderWindow()
    this.addFinalListeners()
    this.addedListeners = true
  }

  private renderWindow() {
    this.selection
      .datum(this.data)
      .classed('chart-window-parcoord', true)
      .call((s) => windowChartBaseRender(s))
      .each((chartWindowD, i, g) => {
        const chartWindowS = select<HTMLDivElement, IChartParcoordData>(g[i])
        const menuItemsS = chartWindowS.selectAll('.menu-tools > .items')
        const layouterS = chartWindowS.selectAll<HTMLDivElement, any>('.layouter');

        // download svg
        menuItemsS
          .selectAll<HTMLLIElement, any>('.tool-download-svg')
          .data([null])
          .join('li')
          .call((s) => toolDownloadSVGRender(s));

        // chart
        const chartS = layouterS
          .selectAll<SVGSVGElement, IChartParcoordData>('svg.chart-parcoord')
          .data([chartWindowD])
          .join('svg')
          .call((s) => chartParcoordRender(s));

        layouterS
          .on('boundschange.chartwindowparcoords', () => chartParcoordRender(chartS))
          .call((s) => layouterCompute(s));
      })
  }

  private addFinalListeners() {
    if (this.addedListeners) return
    const instance = this
    this.selection.on('resize.final', () => { instance.renderWindow() });
  }

}
