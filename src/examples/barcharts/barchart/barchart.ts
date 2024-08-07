import data from './data/austrian-cities.js'

// Make sure to have executed gulp build task before importing from respvis-bar (dependency-based)
// Note that no watcher is configured for dependency-based modules, so live coding will not work
// when making changes in ts source code
// import {BarChart, BarChartUserArgs} from './libs/respvis/respvis-bar.js'
import {BarChart, BarChartUserArgs, format, select} from './libs/respvis/respvis.js'

export async function createBarCart(selector: string) {
  const tickOrientationHorizontal = {
    scope: 'self',
      dependentOn: 'width',
      breakpointValues: {0: 90, 2: 0} //{0: 90, 1: -180, 3: 179} // demonstration purposes
  } as const
  const tickOrientationVertical = {
    scope: 'self',
    dependentOn: 'height',
    breakpointValues: {0: 0, 2: 90} //{0: -180, 1: -180, 3: 179} // demonstration purposes
  } as const
  const axisBoundsWidth = {
    values: [10, 30, 50],
      unit: 'rem'
  } as const
  const axisBoundsHeight = {
    values: [10, 20, 30],
    unit: 'rem'
  } as const
  const barChartArgs: BarChartUserArgs = {
    series: {
      x: { values: data.cities },
      y: { values: data.populations },
      // categoriesTitle: 'City',
      markerTooltipGenerator: (i, d) => `City: ${d.xValue}<br/>Population: ${d.yValue}`,
      flipped: {
        dependentOn: 'width',
        mapping: {0: true, 2: false}
      },
      zoom: {
        in: 20,
        out: 1
      },
      labels: { values: data.populations, offset: 6}
    },
    breakpoints: {
      width: {
        values: [20, 30, 50],
        unit: 'rem'
      }
    },
    title: {
      dependentOn: 'width',
      mapping: {0: 'Population of Austria', 2: 'Population of Austrian Cities'},
    },
    x: {
      title: 'Cities',
      breakpoints: {
        width: axisBoundsWidth,
        height: axisBoundsHeight
      },
      tickOrientation: tickOrientationHorizontal,
      tickOrientationFlipped: tickOrientationVertical
    },
    y: {
      title: 'Population',
      breakpoints: {
        height: axisBoundsHeight,
        width: axisBoundsWidth
      },
      tickOrientation: tickOrientationVertical,
      tickOrientationFlipped: tickOrientationHorizontal,
      configureAxis: (axis) => axis.tickFormat(format('.2s')),
    }
  }

  //Example for custom chart with no highlight and tooltips
  // class BarChartCustom extends BarChart {
  //   renderContent() {
  //     this.renderSeriesChartComponents()
  //     const series = this.chartS.datum().series.cloneFiltered().cloneZoomed() as BarSeries
  //     const seriesS = renderBarSeries(this.drawAreaS, [series])
  //     const barS = seriesS.selectAll<SVGRectElement, Bar>('.bar:not(.exiting):not(.exit-done)')
  //     const bars = barS.data()
  //
  //     // this.addAllSeriesFeatures(seriesS)
  //     seriesS
  //       // .call(addSeriesHighlighting)
  //       // .call(addSeriesConfigTooltipsEvents)
  //       .call((s) => this.addSeriesLabels(s))
  //     this.drawAreaS.selectAll('.series-label')
  //       .attr( 'layout-strategy', bars[0]?.labelData?.positionStrategy ?? null)
  //
  //     this.addCartesianFeatures()
  //     this.addFilterListener()
  //   }
  // }

  const chartWindow = select(selector).append('div')
  const renderer = new BarChart(chartWindow, barChartArgs)
  renderer.buildChart()


  // const chartEmpty = new Chart(chartWindow, {...barChartArgs, type: 'bar'})
  //   chartWindow
  //   .datum(
  //     validateBarChart({...barChartArgs, renderer: chartEmpty})
  //   )
  //   .call(chartWindowBarRender)
  //   .call(chartWindowBarAutoResize)
  //   .call(chartWindowBarAutoFilterCategories());
}
