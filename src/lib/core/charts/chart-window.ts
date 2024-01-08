import {ChartPointData} from "../../points";
import {Selection} from "d3";
import {toolbarRender} from "./chart-base";
import {toolDownloadSVGRender} from "../tools/tool-download-svg";
import {layouterRender} from "../layouter";
import {elementFromSelection} from "../utilities/d3/util";
import {updateBoundStateInCSS, validateBounds} from "../utilities/resizing/bounds";
import {resizeEventListener} from "../resize-event-dispatcher";
import {LengthDimensionBounds} from "../utilities/resizing/matchBounds";

export type ChartWindowSelection = Selection<HTMLDivElement, ChartWindowValid>
export type ChartWindowArgs = {
  type: 'point' | 'bar' | 'line',
  bounds?: Partial<LengthDimensionBounds>

  //toolbar stuff comes here
  //wrapper for container queries stuff
}
export type ChartWindowValid = Required<Omit<ChartWindowArgs, 'bounds'>> & {
  bounds: LengthDimensionBounds,
}

export class ChartWindow {
  private data: ChartWindowValid;

  constructor(public selection: ChartWindowSelection, data: ChartWindowArgs) {
    this.data = {
      ...data,
      bounds: {
        width: validateBounds(data.bounds?.width),
        height: validateBounds(data.bounds?.height)
      },
    }
  }

  public render() {
    this.selection
      .datum(this.data)
      .classed('chart-window', true)
      .classed(`chart-window-${this.data.type}`, true)

    this.updateCSS()

    const toolbarS = this.selection
      .selectAll<HTMLDivElement, any>('.toolbar')
      .data([null])
      .join('div')
      .call((s) => toolbarRender(s));

    const menuItemsS = this.selection.selectAll('.menu-tools > .items')
      .selectAll<HTMLLIElement, any>('.tool-download-svg')
      .data([null])
      .join('li')
      .call((s) => toolDownloadSVGRender(s));

    const layouterS = this.selection
      .selectAll<HTMLDivElement, any>('.layouter')
      .data([null])
      .join('div')
      .call((s) => layouterRender(s));

    const chartS = layouterS
      .selectAll<SVGSVGElement, ChartPointData>(`svg.chart-${this.data.type}`)
      .data([this.data])
      .join('svg')
      // .call((s) => chartPointRender(s));


    resizeEventListener(this.selection);
    return {chartWindowS: this.selection, menuItemsS, layouterS, chartS}
  }

  private updateCSS() {
    const chartWindowElement = elementFromSelection(this.selection)
    const chartBaseValid = this.selection.data()[0]
    updateBoundStateInCSS(chartWindowElement, chartBaseValid.bounds)
  }
}
