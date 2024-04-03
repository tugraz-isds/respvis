import {BarChart, BarChartUserArgs} from './libs/respvis/respvis.js';
import {compensations, sites, years} from './data/compensation-employees.js';
import * as d3 from './libs/d3-7.6.0/d3.js'

export function renderGroupedBarChart(selector: string) {
  const tickOrientationHorizontal = {
    scope: 'self',
    dependentOn: 'width',
    mapping: {0: 90, 3: 0} //{0: 90, 1: -180, 3: 179} // demonstration purposes
  } as const
  const tickOrientationVertical = {
    scope: 'self',
    dependentOn: 'height',
    mapping: {0: 0, 3: 90} //{0: -180, 1: -180, 3: 179} // demonstration purposes
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
      type: 'grouped',
      x: { values: sites },
      y: { values: compensations },
      categories: {
        values: years,
        title: 'Years'
      },
      markerTooltips: {
        tooltips: ((e, d) => {
          return `Site: ${d.xValue}<br/>
                Total Remuneration: $${d3.format(',')(d.yValue)}<br/>
                Year: ${d.label}<br/>`
        })
      },
      flipped: {
        dependentOn: 'width',
        mapping: {0: true, 2: false}
      },
      zoom: {
        in: 20,
        out: 1
      }
    },
    bounds: {
      width: {
        values: [20, 30, 50],
        unit: 'rem'
      }
    },
    legend: {
      title: 'Year'
    },
    // title: {
    //   dependentOn: 'width',
    //   mapping: {0: 'Population of Austria', 2: 'Population of Austrian Cities'},
    // },
    x: {
      title: 'Country',
      bounds: {
        width: axisBoundsWidth,
        height: axisBoundsHeight
      },
      // tickOrientation: tickOrientationHorizontal,
      // tickOrientationFlipped: tickOrientationVertical
    },
    y: {
      title: 'Total Remuneration',
      subTitle: '[EU]',
      bounds: {
        height: axisBoundsHeight,
        width: axisBoundsWidth
      },
      // tickOrientation: tickOrientationVertical,
      tickOrientationFlipped: tickOrientationHorizontal,
      configureAxis: {
        dependentOn: 'width',
        scope: 'chart',
        mapping: {0: (axis) => axis.tickFormat(d3.format('.2s')), 3: (axis) => axis.tickFormat()}
      },
    }
  }

  const chartWindow = d3.select(selector).append('div')
  const renderer = new BarChart(chartWindow, barChartArgs)
  renderer.addCustomListener('resize.custom', (event, data) => {
    // chooseResponsiveData(event.target, data)
  })
  renderer.buildChart()
}
