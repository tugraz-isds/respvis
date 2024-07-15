import {select, timeFormat, timeYear} from './libs/d3-7.6.0/d3.js'
import {LineChart, LineChartUserArgs} from './libs/respvis/respvis.js';
import {mapPowerConsumptionData} from './data/electric-power-consumption.js'

export const renderMultiLineChart = (selector: string) => {
  const {yUSA, yEurope, yAsia, yearsJSDateFormat} = mapPowerConsumptionData()
  // const domainConsumption = [0, 14000]
  // scale: scalePow().domain(domainConsumption).exponent(2)

  const categories = [
    ...yUSA.map(() => 'USA'),
    ...yEurope.map(() => 'Europe'),
    ...yAsia.map(() => 'Asia')]

  const data: LineChartUserArgs = {
    series: {
      x: {values: [...yearsJSDateFormat, ...yearsJSDateFormat, ...yearsJSDateFormat]},
      y: {values: [...yUSA, ...yEurope, ...yAsia]},
      categories: {
        values: categories,
        title: 'Continents'
      },
      markerTooltipGenerator: (_, point) =>
        `Year: ${(point.xValue as Date).getFullYear()}<br/>Pow. Consumption: ${point.yValue}kWh`,
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
    subTitle: {
      dependentOn: 'width',
      mapping: {0: 'TU Graz', 1: ''}
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
      gridLineFactor: 2
    },
    // legend: {
    //   symbols: (e, s) => pathCircle(e, circleInsideRect({...s, x: 0, y:0})),
    //   reverse: true
    // }
  }

  const chartWindow = select(selector).append('div')
  const renderer = new LineChart(chartWindow, data)
  renderer.buildChart()
}

