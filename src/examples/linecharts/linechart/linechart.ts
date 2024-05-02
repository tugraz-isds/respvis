import {formatWithDecimalZero, LineChart, LineChartUserArgs} from './libs/respvis/respvis.js';
import {students, years} from './data/students-tugraz.js';
import * as d3 from './libs/d3-7.6.0/d3.js'
import {format} from './libs/d3-7.6.0/d3.js'

export function createLineChart(selector: string) {
  const data: LineChartUserArgs = {
    series: {
      x: { values: years },
      y: { values: students },
      markerTooltips: {
        tooltips: (_, {xValue, yValue}) =>
          `Year: ${xValue}<br/>Students: ${d3.format('.2f')(yValue)}`,
      },
      zoom: {
        in: 20,
        out: 1
      },
      labels: {
        values: students,
        offset: 6,
        format: (bar, label) => d3.format('.3s')(label)
      }
    },
    breakPoints: {
      width: {
        values: [20, 30, 50],
        unit: 'rem'
      }
    },
    title: {
      dependentOn: 'width',
      mapping: {0: 'Registered Students', 1 : 'Students at TU Graz', 3: 'Students Registered at TU Graz'}
    },
    subTitle: {
      dependentOn: 'width',
      mapping: {0: 'TU Graz', 1 : ''}
    },
    x: {
      title: 'Year',
      subTitle: '[2012 to 2021]',
      bounds: {
        width: {
          values: [10, 30, 50],
          unit: 'rem'
        }
      },
      configureAxis: (axis) => axis.tickFormat(format('.3d'))
    },
    y: {
      title: 'Students',
      subTitle: '[Winter Semester]',
      configureAxis: {
        dependentOn: 'width',
        scope: 'chart',
        mapping: {0: (axis) => axis.tickFormat(formatWithDecimalZero(format('.2s'))),
          2: (axis) => axis.tickFormat(formatWithDecimalZero(format(',')))
        }
      }
    }
  }

  const chartWindow = d3.select(selector).append('div')
  const renderer = new LineChart(chartWindow, data)
  renderer.buildChart()
}
