import {BarChart, BarChartUserArgs} from './libs/respvis/respvis.js';
import * as d3 from './libs/d3-7.6.0/d3.js'
import data from './data/austrian-cities.js';
import {chooseResponsiveData} from "./chooseResponsiveData.js";

export function createBarCart(selector: string) {
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
      x: { values: data.cities },
      y: { values: data.populations },
      categoriesTitle: 'City',
      markerTooltips: {
        tooltips: (i, d) => `City: ${d.xValue}<br/>Population: ${d.yValue}`,
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
      mapping: {0: 'Population of Austria', 2: 'Population of Austrian Cities'},
    },
    x: {
      title: 'Cities',
      bounds: {
        width: axisBoundsWidth,
        height: axisBoundsHeight
      },
      tickOrientation: tickOrientationHorizontal,
      tickOrientationFlipped: tickOrientationVertical
    },
    y: {
      title: 'Population',
      bounds: {
        height: axisBoundsHeight,
        width: axisBoundsWidth
      },
      tickOrientation: tickOrientationVertical,
      tickOrientationFlipped: tickOrientationHorizontal,
      configureAxis: (axis) => axis.tickFormat(d3.format('.2s')),
    },
    legend: {
      title: {
        dependentOn: 'width',
        scope: 'chart',
        mapping: {0: '', 3: 'Legend'}
      }
    }
  }

  const chartWindow = d3.select(selector).append('div')
  const renderer = new BarChart(chartWindow, barChartArgs)
  renderer.addCustomListener('resize.custom', (event, data) => {
    chooseResponsiveData(event.target, data)
  })
  renderer.buildChart()
}

// const barChartArgs: BarChartUserArgs = {
//   bounds: {
//     width: {
//       values: [20, 30, 50],
//       unit: 'rem'
//     }
//   },
//   title: {
//     dependentOn: 'width',
//     mapping: {0: 'Population of Austria', 2: 'Population of Austrian Cities'},
//   },
//   x: {
//     values: data.cities,
//     categoriesTitle: 'City',
//     title: 'Cities',
//     bounds: {
//       width: {
//         values: [10, 30, 50],
//         unit: 'rem'
//       }
//     },
//     tickOrientation: {
//       orientation: {
//         scope: 'self',
//         dependentOn: 'width',
//         mapping: {0: 'vertical', 3: 'horizontal'}
//       },
//       rotationDirection: 'counterclockwise'
//     },
//   },
//   // flipped: {
//   //   dependentOn: 'width',
//   //   mapping: {0: true, 2: false}
//   // },
//   y: {
//     title: 'Population',
//     bounds: {
//       height: {
//         values: [10, 30, 50],
//         unit: 'rem'
//       }
//     },
//     tickOrientation: {
//       orientation: {
//         scope: 'self',
//         dependentOn: 'height',
//         mapping: {0: 'horizontal', 2: 'vertical'}
//       },
//       rotationDirection: 'counterclockwise'
//     },
//     configureAxis: (axis) => axis.tickFormat(d3.format('.2s')),
//     values: data.populations
//   },
//   legend: {
//     title: {
//       dependentOn: 'width',
//       scope: 'chart',
//       mapping: {0: '', 3: 'Legend'}
//     }
//   },
//   markerTooltips: {
//     tooltips: (i, d) => `City: ${d.xValue}<br/>Population: ${d.yValue}`,
//   },
// }
