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
  abstract windowS: WindowSelection
  get chartS(): ChartSelection {
    return ((this._chartS && !this._chartS.empty()) ? this._chartS :
      this.layouterS.selectAll('svg.chart')) as ChartSelection
  }

  protected override addBuiltInListeners() {
    super.addBuiltInListeners()
    this.addFilterListener()
  }

  private addFilterListener() {
    const renderer = this
    this.filterDispatch.on('filter', function() {
      const currentKey = this.dataKey
      const chartD = renderer.windowS.datum()

      chartD.getAxes().forEach(axis => {
        if ('key' in axis) {
          axis.setKeyActiveIfDefined(currentKey, !axis.isKeyActiveByKey(currentKey))
        }
        axis.scaledValues.setKeyActiveIfDefined(currentKey, !axis.scaledValues.isKeyActiveByKey(currentKey))
      })

      chartD.getSeries().forEach(series => {
        if (series.keysActive[currentKey] !== undefined) {
          series.keysActive[currentKey] = !series.keysActive[currentKey]
        }
        series.categories?.setKeyActiveIfDefined(currentKey, !series.categories?.keysActive[currentKey])
      })
      renderer.windowS.dispatch('resize')
    })
  }

  protected mainRender() {
    super.mainRender()
    const chartSelection = this.chartS!
    const chartD = chartSelection.datum()
    chartD.getSeries().forEach(series => series.responsiveState.update())
    const legendS = legendRender(chartSelection, chartD.legend)
    legendAddHover(legendS)

    toolbarRender(this.windowS!, chartSelection.datum())
  }
}
