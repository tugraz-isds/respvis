import {Chart} from "../chart";
import {Selection} from "d3";
import {SeriesChartData} from "./series-chart";
import {Window} from "../../window";
import {renderLegend} from "../../legend";
import {addLegendHoverHighlighting} from "../../legend/legend-highlighting";
import {renderToolbar} from "../../toolbar/render-toolbar";
import {Series} from "../../series";
import {addSeriesHighlighting} from "../../series/series-highlighting";
import {renderSeriesTooltip} from "respvis-tooltip";
import {renderLabelSeries} from "../../label";
import {Primitive} from "../../primitive/primitive";

export abstract class SeriesChartMixin extends Chart {
  abstract get windowS(): Selection<HTMLElement, Window & SeriesChartData>
  abstract get chartS(): Selection<SVGSVGElement, Window & SeriesChartData>

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

  renderSeriesChartComponents() {
    const chartSelection = this.chartS!
    const chartD = chartSelection.datum()
    chartD.getSeries().forEach(series => series.responsiveState.update())
    renderLegend(chartSelection, chartD.legend).call(addLegendHoverHighlighting)
    renderToolbar(this.windowS!, chartSelection.datum())
  }

  addSeriesLabels(seriesS: Selection<SVGGElement, Series>) {
    const seriesElementsS = seriesS.selectAll<any, Primitive>('.bar:not(.exiting):not(.exit-done)')
    renderLabelSeries(this.drawAreaS, {
      elements: seriesElementsS.data(),
      classes: ['series-label'],
      orientation: seriesS.datum().responsiveState.currentlyFlipped ? 'horizontal' : 'vertical'
    })
  }

  addAllSeriesFeatures(seriesS: Selection<SVGGElement, Series>) {
    seriesS.call(addSeriesHighlighting)
      .call(renderSeriesTooltip)
      .call((s) => this.addSeriesLabels(s))
  }
}
