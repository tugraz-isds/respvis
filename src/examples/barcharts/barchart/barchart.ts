import {BarChart, BarChartUserArgs} from './libs/respvis/respvis.js';
import * as d3 from './libs/d3-7.6.0/d3.js'
import data from './data/austrian-cities.js';
import {chooseResponsiveData} from "./chooseResponsiveData.js";

export function createBarCart(selector: string) {
  const barChartArgs: BarChartUserArgs = {
    series: {
      xValues: data.cities,
      yValues: data.populations,
      categoriesTitle: 'City',
      markerTooltips: {
        tooltips: (i, d) => `City: ${d.xValue}<br/>Population: ${d.yValue}`,
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
        width: {
          values: [10, 30, 50],
          unit: 'rem'
        }
      },
      tickOrientation: {
        orientation: {
          scope: 'self',
          dependentOn: 'width',
          mapping: {0: 'vertical', 3: 'horizontal'}
        },
        rotationDirection: 'counterclockwise'
      },
    },
    // flipped: {
    //   dependentOn: 'width',
    //   mapping: {0: true, 2: false}
    // },
    y: {
      title: 'Population',
      bounds: {
        height: {
          values: [10, 30, 50],
          unit: 'rem'
        }
      },
      tickOrientation: {
        orientation: {
          scope: 'self',
          dependentOn: 'height',
          mapping: {0: 'horizontal', 2: 'vertical'}
        },
        rotationDirection: 'counterclockwise'
      },
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
