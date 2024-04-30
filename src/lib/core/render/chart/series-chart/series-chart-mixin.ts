import {Chart} from "../chart";
import {Selection} from "d3";
import {SeriesChartValid} from "./series-chart-validation";
import {WindowValid} from "../../window";
import {legendRender} from "../../legend";
import {legendAddHover} from "../../legend/legend-event";
import {toolbarRender} from "../../toolbar/toolbar-render";
import {Series} from "../../series";
import {addHighlight} from "../../series/series-add-highlight";
import {seriesConfigTooltipsHandleEvents} from "../../../../tooltip";
import {labelSeriesFromElementsRender} from "../../label/todo/series-label";
import {RenderElement} from "../../../utilities/graphic-elements/render-element";

export abstract class SeriesChartMixin extends Chart {
  abstract get windowS(): Selection<HTMLElement, WindowValid & SeriesChartValid>
  abstract get chartS(): Selection<SVGSVGElement, WindowValid & SeriesChartValid>
  addFilterListener() {
    const renderer = this
    renderer.windowS
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
  seriesRequirementsRender() {
    const chartSelection = this.chartS!
    const chartD = chartSelection.datum()
    chartD.getSeries().forEach(series => series.responsiveState.update())
    legendRender(chartSelection, chartD.legend).call(legendAddHover)
    toolbarRender(this.windowS!, chartSelection.datum())
  }
  addSeriesFeatures(seriesS: Selection<SVGGElement, Series>) {
    const seriesElementsS = seriesS.selectAll<any, RenderElement>('.bar:not(.exiting):not(.exit-done)')
    const renderElements = seriesElementsS.data()
    const series = seriesS.datum()
    seriesS.call(addHighlight)
      .call(seriesConfigTooltipsHandleEvents)
      .call(() => labelSeriesFromElementsRender(this.drawAreaS, {
          elements: renderElements,
          classes: ['series-label'],
          orientation: series.responsiveState.currentlyFlipped ? 'horizontal' : 'vertical'
        })
      )
  }
}
