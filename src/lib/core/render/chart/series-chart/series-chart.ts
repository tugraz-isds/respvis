import {Chart} from "../chart";
import {Selection} from "d3";
import {SVGHTMLElement} from "../../../constants/types";
import {SeriesChartValid} from "./series-chart-validation";
import {WindowValid} from "../../window";
import {legendRender} from "../../legend";
import {legendAddHover} from "../../legend/legend-event";
import {toolbarRender} from "../../toolbar/toolbar-render";

type WindowSelection = Selection<SVGHTMLElement, WindowValid & SeriesChartValid>
type ChartSelection = Selection<SVGSVGElement, WindowValid & SeriesChartValid>

export abstract class SeriesChart extends Chart {
  abstract windowSelection: WindowSelection
  chartSelection?: ChartSelection

  protected mainRender() {
    super.mainRender()
    const chartSelection = this.chartSelection!
    const { legend } = chartSelection.datum()
    const legendS = legendRender(chartSelection, legend)
    legendAddHover(legendS)
    toolbarRender(this.windowSelection!, chartSelection.datum())
  }
}
