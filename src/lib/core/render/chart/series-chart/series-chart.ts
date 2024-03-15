import {Chart} from "../chart";
import {select, Selection} from "d3";
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
    this.addCustomListener('change.filter', (e) => {
      if (!e.target) return
      const changeS = select(e.target as SVGHTMLElement)
      if (changeS.attr('type') !== 'checkbox') return
      // const parentS = changeS.select(function() {return this.parentElement})
      // const currentKey = parentS.attr('data-key')
      const currentKey = changeS.attr('data-key')
      if (!currentKey) return

      const newActive = changeS.property('checked')

      this.windowSelection.datum().getAxes().forEach(axis => {
        axis.scaledValues.setKeyActiveIfDefined(currentKey, newActive)
      })

      this.windowSelection.datum().getSeries().forEach(series => {
        if (series.keysActive[currentKey] !== undefined) {
          series.keysActive[currentKey] = newActive
        }
        series.categories?.setKeyActiveIfDefined(currentKey, changeS.property('checked'))
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
