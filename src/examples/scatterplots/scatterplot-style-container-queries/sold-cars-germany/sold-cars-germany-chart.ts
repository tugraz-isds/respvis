import * as d3 from '../libs/d3-7.6.0/d3.js'
import {format} from '../libs/d3-7.6.0/d3.js'
import {formatWithDecimalZero, ScatterPlot, ScatterPlotUserArgs} from '../libs/respvis/respvis.js'
import {getTopMakesData} from './data/sold-cars-germany.js';

export function createChartSoldCarsGermany(selector: string) {
  const {mileages, horsePower, prices, makes} = getTopMakesData(5)
  //TODO: default scales not working like that. Find reason why
  const baseScaleX = d3.scaleLinear()
    .domain([0, Math.max(...horsePower)])
    .nice()
  const baseScaleY = d3.scaleLinear()
    .domain([0, Math.max(...prices)])
    .nice()
  const radiusScale = d3.scaleLinear()
    .domain([0, Math.max(...mileages)])
    .range([5, 20])

  const scales = {
    xScale: baseScaleX,
    yScale: baseScaleY,
    radiusScale
  }

  const data: ScatterPlotUserArgs = {
    series: {
      x: {
        values: horsePower,
        scale: scales.xScale
      },
      y: {
        values: prices,
        scale: scales.yScale
      },
      categories: {
        values: makes,
        title: 'Makes'
      },
      radii: {
        values: mileages,
        scale: {
          dependentOn: 'width',
          value: scales.radiusScale,
          mapping: {
            0: s => s.range([3, 12]),
            2: s => s.range([4, 16]),
            3: s => s.range([5, 20])
          }
        },
      },
      markerTooltipGenerator: ((e, d) => {
        return `Car Price: ${d.yValue}€<br/>
                Horse Power: ${d.xValue}PS<br/>
                Make: ${d.categoryFormatted ?? ''}<br/>
                Mileage: ${d.radiusValue}km<br/>`
      }),
      flipped: {
        dependentOn: 'width',
        mapping: {0: true, 2: false}
      },
      zoom: {
        in: 20,
        out: 1
      }
      // labelCallback: (label: string) => {
      //   // console.log(label)
      //   return label + '1'
      // }
    },
    breakpoints: {
      width: {
        values: [20, 30, 50],
        unit: 'rem'
      }
    },
    title: {
      dependentOn: 'width',
      mapping: {0: 'Car Chars.', 1 : 'Car Characteristics', 3: 'Car Characteristics from AutoScout24 in Germany'}
    },
    x: {
      title: {
        dependentOn: 'width',
        mapping: {0: 'HP in [PS]', 1: 'Horse P. [PS]', 2: 'Horse Power in [PS]'}
      },
      breakpoints: {
        width: {
          values: [10, 30, 50],
          unit: 'rem'
        }
      },
      configureAxis: (axis) => axis.tickFormat(format('.3d'))
    },
    y: {
      title: 'Car Price [EU]',
      configureAxis: {
        dependentOn: 'width',
        scope: 'chart',
        mapping: {0: (axis) => axis.tickFormat(formatWithDecimalZero(format('.2s'))),
          2: (axis) => axis.tickFormat(formatWithDecimalZero(format(',')))
        }
      }
    },
    legend: {
      title: {
        dependentOn: 'width',
        scope: 'chart',
        mapping: {0: '', 3: 'Legend'}
      },
    }
  };

  const chartWindow = d3.select(selector).append('div')
  const renderer = new ScatterPlot(chartWindow, data)
  renderer.buildChart()
}
