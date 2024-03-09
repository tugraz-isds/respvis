import {BarChart, BarChartUserArgs} from './libs/respvis/respvis.js';
import * as d3 from './libs/d3-7.6.0/d3.js'
import * as data from './data/global-temperature-anomalies.js';

export function createBarChart(selector: string) {
  const tickOrientationHorizontal = {
    scope: 'self',
      dependentOn: 'width',
      mapping: {0: 90, 1: 90, 3: 30} //{0: 90, 1: -180, 3: 179} // demonstration purposes
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
      x: { values: data.months, scale: d3.scaleBand().domain(data.years).padding(0.1) },
      y: { values: data.anomalies,
        scale: d3.scaleLinear().domain([Math.min(...data.anomalies), Math.max(...data.anomalies)]).nice() },
      // categoriesTitle: 'City',
      markerTooltips: {
        tooltips: (i, d) => `Month: ${d.xValue}<br/>Anomalie: ${d.yValue}°C`,
      },
      flipped: {
        dependentOn: 'width',
        mapping: {0: true, 2: false}
      },
    },
    bounds: {
      width: {
        values: [20, 30, 50],
        unit: 'rem'
      }
    },
    title: {
      dependentOn: 'width',
      mapping: {0: 'Temperature Anomalies', 2: 'Global Temperature Anomalies'},
    },
    x: {
      title: 'Months',
      bounds: {
        width: axisBoundsWidth,
        height: axisBoundsHeight
      },
      tickOrientation: tickOrientationHorizontal,
      // tickOrientationFlipped: tickOrientationVertical
    },
    y: {
      title: 'Anomalies',
      subTitle: '[°C]',
      bounds: {
        height: axisBoundsHeight,
        width: axisBoundsWidth
      },
      // tickOrientation: tickOrientationVertical,
      tickOrientationFlipped: tickOrientationHorizontal,
      configureAxis: (axis) => axis.tickFormat(d3.format('.2')),
    },
    // zoom: { //TODO: make bar chart work with zooming!
    //   in: 20,
    //   out: 1
    // }
    // legend: {
    //   title: {
    //     dependentOn: 'width',
    //     scope: 'chart',
    //     mapping: {0: '', 3: 'Legend'}
    //   }
    // }
  }

  const chartWindow = d3.select(selector).append('div')
  const renderer = new BarChart(chartWindow, barChartArgs)
  renderer.buildChart()
}


export function createBarChartAggregated(selector: string) {
  const tickOrientationHorizontal = {
    scope: 'self',
    dependentOn: 'width',
    mapping: {0: 90, 1: 90, 3: 30} //{0: 90, 1: -180, 3: 179} // demonstration purposes
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
      x: { values: data.years, scale: d3.scaleBand().domain(data.years).padding(0.8)},
      y: { values: [data.anomalies_1885, data.anomalies_2023],
        scale: d3.scaleLinear().domain([Math.min(...data.anomalies), Math.max(...data.anomalies)]).nice() },
      // categoriesTitle: 'City',
      markerTooltips: {
        tooltips: (i, d) => `Month: ${d.xValue}<br/>Anomalie: ${d.yValue}°C`,
      },
      flipped: {
        dependentOn: 'width',
        mapping: {0: true, 2: false}
      },
    },
    bounds: {
      width: {
        values: [20, 30, 50],
        unit: 'rem'
      }
    },
    title: {
      dependentOn: 'width',
      mapping: {0: 'Temperature Anomalies', 2: 'Global Temperature Anomalies'},
    },
    x: {
      title: 'Months',
      bounds: {
        width: axisBoundsWidth,
        height: axisBoundsHeight
      },
      tickOrientation: tickOrientationHorizontal,
      tickOrientationFlipped: tickOrientationVertical
    },
    y: {
      title: 'Anomalies',
      subTitle: '[°C]',
      bounds: {
        height: axisBoundsHeight,
        width: axisBoundsWidth
      },
      tickOrientation: tickOrientationVertical,
      tickOrientationFlipped: tickOrientationHorizontal,
      configureAxis: (axis) => axis.tickFormat(d3.format('.2')),
    },
    // zoom: { //TODO: make bar chart work with zooming!
    //   in: 20,
    //   out: 1
    // }
    // legend: {
    //   title: {
    //     dependentOn: 'width',
    //     scope: 'chart',
    //     mapping: {0: '', 3: 'Legend'}
    //   }
    // }
  }

  const chartWindow = d3.select(selector).append('div')
  const renderer = new BarChart(chartWindow, barChartArgs)
  renderer.buildChart()
}
