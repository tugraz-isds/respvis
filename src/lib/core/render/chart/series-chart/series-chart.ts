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

  protected override addBuiltInListeners() {
    super.addBuiltInListeners()
    this.addFilterListener()
  }

  private addFilterListener() {
    const renderer = this
    this.filterDispatch.on('filter', function() {
      const currentKey = this.dataKey
      const chartD = renderer.windowSelection.datum()

      chartD.getAxes().forEach(axis => {
        axis.scaledValues.setKeyActiveIfDefined(currentKey, !axis.scaledValues.isKeyActiveByKey(currentKey))
      })

      chartD.getSeries().forEach(series => {
        if (series.keysActive[currentKey] !== undefined) {
          series.keysActive[currentKey] = !series.keysActive[currentKey]
        }
        series.categories?.setKeyActiveIfDefined(currentKey, !series.categories?.keysActive[currentKey])
      })
      renderer.windowSelection.dispatch('resize')
    })
  }

  protected mainRender() {
    super.mainRender()
    const chartSelection = this.chartSelection!
    const { legend } = chartSelection.datum()
    const legendS = legendRender(chartSelection, legend)
    legendAddHover(legendS)
    toolbarRender(this.windowSelection!, chartSelection.datum())
  }
}
