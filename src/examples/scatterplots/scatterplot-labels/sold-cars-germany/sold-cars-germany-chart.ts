import * as d3 from '../libs/d3-7.6.0/d3.js'
import {format} from '../libs/d3-7.6.0/d3.js'
import {formatWithDecimalZero, Point, ScatterPlot, ScatterPlotUserArgs} from '../libs/respvis/respvis.js'
import {getTopMakesData} from './data/sold-cars-germany.js';

export function createChartSoldCarsGermany(selector) {
  const {horsePower: horsePowerAll, prices: pricesAll, makes: makesAll} = getTopMakesData(5)
  const elements = [1, 3, 4, 105, 205, 350, 400, 360]
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
        extrema: {
          dependentOn: 'width',
          breakpointValues: {
            0: {minimum: 3, maximum: 12},
            1: {minimum: 5, maximum: 15},
            2: {minimum: 7, maximum: 30},
          }
        },
        axis: {
          title: 'Prices',
          horizontalLayout: 'bottom',
          configureAxis: (axis => {
            axis.ticks(2)
            axis.tickFormat(d3.format('.2s'))
          })
        }
      },
      // radii: {
      //   dependentOn: 'width',
      //   breakpointValues: { 0: 3, 1: 10, 2: 20}
      // },
      markerTooltipGenerator: ((e, d: Point) => {
        return `Car Price: ${d.radiusValue}€<br/>
                Horse Power: ${d.yValue}PS<br/>
                Make: ${d.xValue ?? ''}<br/>`
      }),
      zoom: {
        in: 20,
        out: 1
      },
      labels: {
        values: makes,
        offset: 3,
        positionStrategyHorizontal: 'right',
        positionStrategyVertical: 'top'
      }
      // labelCallback: (label: string) => {
      //   // console.log(label)
      //   return label + '1'
      // }
    },
    breakpoints: {
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
      breakpoints: {
        width: {
          values: [10, 40, 50],
          unit: 'rem'
        }
      },
      tickOrientation: {
        scope: 'self',
        dependentOn: 'width',
        breakpointValues: {0: 90, 2: 0}
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
    }
  };

  const chartWindow = d3.select(selector).append('div')
  const renderer = new ScatterPlot(chartWindow, data)
  renderer.buildChart()
}

