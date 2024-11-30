import {LineChart, LineChartUserArgs, select, selectAll, timeFormat, timeYear} from './libs/respvis/respvis.js';
import {mapPowerConsumptionData} from './data/electric-power-consumption.js'

export const renderMultiLineChart = (selector: string) => {
  const {yUSA, yEurope, yAsia, yearsJSDateFormat} = mapPowerConsumptionData()

  const data: LineChartUserArgs = {
    series: {
      x: {values: [...yearsJSDateFormat, ...yearsJSDateFormat, ...yearsJSDateFormat]},
      y: {values: [...yUSA, ...yEurope, ...yAsia]},
      categories: {
        values: [
          ...yUSA.map(() => 'USA'),
          ...yEurope.map(() => 'Europe'),
          ...yAsia.map(() => 'Asia')
        ],
        title: 'Continents'
      },
      markerTooltipGenerator: (_, point) =>
        `Year: ${(point.xValue as Date).getFullYear()}
        <br/>Pow. Consumption: ${point.yValue}kWh`,
      zoom: {
        in: 20,
        out: 1
      }
    },
    breakpoints: {
      width: {
        values: [25, 30, 50],
        unit: 'rem'
      }
    },
    title: {
      dependentOn: 'width',
      mapping: {0: 'Power (kWh)', 1: 'Power Consumption (kWh)', 3: 'Electric Power Consumption (kWh per Capita)'}
    },
    x: {
      title: 'Year',
      subTitle: '[2012 to 2021]',
      tickOrientation: {
        dependentOn: 'width',
        scope: 'self',
        breakpointValues: {0: 90, 2: 0},
      },
      breakpoints: {
        width: {
          values: [10, 30, 50],
          unit: 'rem'
        }
      },
      configureAxis: (axis) => {
        axis.ticks(timeYear.every(2))
        axis.tickFormat(timeFormat('%Y'))
      },
      gridLineFactor: 1
    },
    y: {
      title: 'Consumption',
      breakpoints: {
        width: {
          values: [10, 30, 50],
          unit: 'rem'
        }
      },
      tickOrientationFlipped: {
        dependentOn: 'width',
        scope: 'self',
        breakpointValues: {0: 90, 2: 0},
      },
      gridLineFactor: undefined
    },
    tooltip: {
      onInspectMove: (info) => {
        const pointS = selectAll('.point.element')
        const nearestPointS = pointS.filter((d) => d.xValue === info.horizontalNearestRealValue)
        nearestPointS.classed('inspect-nearest', true)
        const otherPointS = pointS.filter((d) => d.xValue !== info.horizontalNearestRealValue)
        otherPointS.classed('inspect-nearest', false)
      }
    }
  }

  const chartWindow = select(selector).append('div')
  const renderer = new LineChart(chartWindow, data)
  renderer.buildChart()
}
