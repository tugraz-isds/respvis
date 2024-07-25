import {Chart} from "../chart";
import {Selection} from "d3";
import {DataSeriesChartData} from "./series-chart";
import {Window} from "../../window";
import {renderLegend} from "../../legend";
import {addLegendHoverHighlighting} from "../../legend/legend-highlighting";
import {renderToolbar} from "../../toolbar/render-toolbar";
import {DataSeries} from "../../data-series";
import {addSeriesHighlighting} from "../../data-series/data-series-highlighting";
import {renderSeriesTooltip} from "respvis-tooltip";
import {renderLabelSeries} from "../../label";
import {MarkerPrimitive} from "../../marker-primitive/marker-primitive";

export abstract class DataSeriesChartMixin extends Chart {
  abstract get windowS(): Selection<HTMLElement, Window & DataSeriesChartData>
  abstract get chartS(): Selection<SVGSVGElement, Window & DataSeriesChartData>

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
        const {keysActive, categories} = series.originalData
        if (keysActive[currentKey] !== undefined) {
          keysActive[currentKey] = !keysActive[currentKey]
        }
        categories?.setKeyActiveIfDefined(currentKey, !categories?.keysActive[currentKey])
      })
      renderer.windowS.dispatch('resize')
    })
  }

  renderSeriesChartComponents() {
    const chartSelection = this.chartS!
    const chartD = chartSelection.datum()
    chartD.getSeries().forEach(series => series.responsiveState.update())
    this.addFilterListener()
    renderLegend(chartSelection, chartD.legend).call(addLegendHoverHighlighting)
    chartD.getSeries().forEach(series => series.renderLegendInfo?.(this.legendS))
    renderToolbar(this.windowS!, chartSelection.datum())
  }

  addSeriesLabels(seriesS: Selection<SVGGElement, DataSeries>) {
    const seriesElementsS = seriesS.selectAll<any, MarkerPrimitive>('.element:not(.exiting):not(.exit-done)')
    renderLabelSeries(this.drawAreaS, {
      elements: seriesElementsS.data(),
      classes: ['series-label'],
      orientation: seriesS.datum().responsiveState.currentlyFlipped ? 'horizontal' : 'vertical'
    })
  }

  addAllSeriesFeatures(seriesS: Selection<SVGGElement, DataSeries>) {
    seriesS.call(addSeriesHighlighting)
      .call(renderSeriesTooltip)
      .call((s) => this.addSeriesLabels(s))
  }
}
