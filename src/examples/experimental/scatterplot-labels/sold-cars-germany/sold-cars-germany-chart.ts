import * as d3 from '../libs/d3-7.6.0/d3.js'
import {format} from '../libs/d3-7.6.0/d3.js'
import {formatWithDecimalZero, ScatterPlot, ScatterPlotUserArgs} from '../libs/respvis/respvis.js'
import {getTopMakesData} from './data/sold-cars-germany.js';
import {chooseResponsiveData} from "./chooseResponsiveData.js";

export function createChartSoldCarsGermany(selector) {
  const {mileages: mileagesAll, horsePower: horsePowerAll, prices: pricesAll, makes: makesAll} = getTopMakesData(5)
  const elements = [1, 3, 4, 105, 205, 350, 400, 360]
  const mileages = elements.map(num => mileagesAll[num])
  const horsePower = elements.map(num => horsePowerAll[num])
  const prices = elements.map(num => pricesAll[num])
  const makes = elements.map(num => makesAll[num])

  //TODO: default scales not working like that. Find reason why
  const baseScaleY = d3.scaleLinear()
    .domain([40, Math.max(...horsePower)])
    .nice()

  const radiusScale = d3.scaleLinear()
    .domain([0, Math.max(...prices)])
    .range([15, 15])

  // const scales = {
  //   radiusScale
  // }


  const data: ScatterPlotUserArgs = {
    series: {
      x: {
        values: makes
      },
      y: {
        values: horsePower,
        scale: baseScaleY
      },
      categories: {
        values: makes,
        title: 'Makes'
      },
      radii: {
        values: prices,
        scale: radiusScale,
      },
      markerTooltips: {
        tooltips: ((e, d) => {
          return `Car Price: ${d.yValue}€<br/>
                Horse Power: ${d.xValue}PS<br/>
                Make: ${d.label}<br/>
                Mileage: ${d.radiusValue}km<br/>`
        })
      },
      // labelCallback: (label: string) => {
      //   // console.log(label)
      //   return label + '1'
      // }
    },
    bounds: {
      width: {
        values: [20, 30, 65],
        unit: 'rem'
      }
    },
    title: {
      dependentOn: 'width',
      mapping: {0: 'Car Chars.', 1: 'Car Characteristics', 3: 'Car Characteristics from AutoScout24 in Germany'}
    },
    x: {
      title: {
        dependentOn: 'width',
        mapping: {0: 'Make', 1: 'Car Make'}
      },
      bounds: {
        width: {
          values: [10, 40, 50],
          unit: 'rem'
        }
      },
      tickOrientation: {
        scope: 'self',
        dependentOn: 'width',
        mapping: {0: 90, 2: 0}
      }
    },
    y: {
      title: {
        dependentOn: 'height',
        scope: 'chart',
        mapping: {0: 'HP in [PS]', 1: 'Horse P. [PS]', 2: 'Horse Power in [PS]'}
      },
      configureAxis: {
        dependentOn: 'width',
        scope: 'chart',
        mapping: {
          0: (axis) => axis.tickFormat(formatWithDecimalZero(format('.2s'))),
          2: (axis) => axis.tickFormat(formatWithDecimalZero(format(',')))
        }
      }
    },
    legend: {
      title: {
        dependentOn: 'width',
        scope: 'chart',
        mapping: {0: '', 2: 'Car Make'}
      },
    },
    zoom: {
      in: 20,
      out: 1
    }
  };

  //'#sold-cars-germany'
  const chartWindow = d3.select(selector).append('div')
  const renderer = new ScatterPlot(chartWindow, data)
  renderer.addCustomListener('resize.custom', (event, data) => {
    chooseResponsiveData(event.target, data)
  })
  renderer.buildChart()
  // const chartWindowData = validateChartWindow(data)
  // renderChartWindow(chartWindow, chartWindowData)
}

// bounds: {
//   width: {
//     values: [20, 30, 50],
//       unit: 'rem'
//   }
// },
// title: {
//   dependentOn: 'width',
//     mapping: {0: 'Car Chars.', 1 : 'Car Characteristics', 3: 'Car Characteristics from AutoScout24 in Germany'}
// },
// x: {
//   values: horsePower,
//     scale: scales.xScale,
//     title: {
//     dependentOn: 'width',
//       mapping: {0: 'HP in [PS]', 1: 'Horse P. [PS]', 2: 'Horse Power in [PS]'}
//   },
//   bounds: {
//     width: {
//       values: [10, 30, 50],
//         unit: 'rem'
//     }
//   },
//   configureAxis: (axis) => axis.tickFormat(format('.3d'))
// },
// y: {
//   values: prices,
//     categories: makes,
//     scale: scales.yScale,
//     title: 'Car Price [EU]',
//     configureAxis: {
//     dependentOn: 'width',
//       scope: 'chart',
//       mapping: {0: (axis) => axis.tickFormat(formatWithDecimalZero(format('.2s'))),
//       2: (axis) => axis.tickFormat(formatWithDecimalZero(format(',')))
//     }
//   }
// },
// legend: {
//   title: {
//     dependentOn: 'width',
//       scope: 'chart',
//       mapping: {0: '', 3: 'Legend'}
//   },
//   // labelCallback: (label: string) => {
//   //   console.log(label)
//   //   return label + '1'
//   // }
// },
// radii: {
//   values: mileages,
//     scale: {
//     dependentOn: 'width',
//       value: scales.radiusScale,
//       mapping: {
//       0: s => s.range([3, 12]),
//         2: s => s.range([4, 16]),
//         3: s => s.range([5, 20])
//     }
//   },
// },
// markerTooltips: {
//   tooltips: ((e, d) => {
//     return `Car Price: ${d.yValue}€<br/>
// Horse Power: ${d.xValue}PS<br/>
// Make: ${d.label}<br/>
// Mileage: ${d.radiusValue}km<br/>`
//   })
// },
// zoom: {
// in: 20,
//     out: 1
// },

