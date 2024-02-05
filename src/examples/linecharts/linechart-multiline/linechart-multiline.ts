import {select} from './libs/d3-7.6.0/d3.js'
import {LineChart, LineChartUserArgs} from './libs/respvis/respvis.js';

import {mapPowerConsumptionData} from './data/electricPowerConsumption.js'
// import {chooseResponsiveData} from "./chooseResponsiveData.js";

export const renderMultiLineChart = (selector: string) => {
  const {yUSA, yEurope, yAsia, years} = mapPowerConsumptionData()
  const calcData = () => {
    return {
      xValues: years,
      yValues: [yUSA, yEurope, yAsia],
      xAxis: {
        title: 'Year',
        configureAxis: (axis) => axis.tickFormat((v) => v),
        tickOrientation: {
          bounds: [ {minWidth: '60rem'}, {minWidth: '30rem'} ],
          orientation: ['horizontal', 'transition', 'vertical'],
          rotationDirection: 'counterclockwise'
        }
      },
      yAxis: {title: 'Consumption'},
      markerTooltips: {
        tooltips: (_, {xValue, yValue}) => `Year: ${xValue}<br/>Pow. Consumption: ${yValue}kWh`
      },
      legend: {
        keys: ['USA', 'Europe', 'East Asia'],
        labels: ['USA', 'Europe', 'East Asia'],
      }
    }
  }

  const chartData = calcData()


  const categories = [
    ...yUSA.map(() => 'USA'),
    ...yEurope.map(() => 'Europe'),
    ...yAsia.map(() => 'Asia')]

  const data: LineChartUserArgs = {
    series: {
      x: { values: [...years, ...years, ...years] },
      y: { values: [...yUSA, ...yEurope, ...yAsia] },
      categories: {
        values: categories,
        title: 'Continents'
      },
      markerTooltips: {
        tooltips: (_, {xValue, yValue}) => `Year: ${xValue}<br/>Pow. Consumption: ${yValue}kWh`
      },
      flipped: {
        dependentOn: 'width',
        mapping: {0: true, 2: false}
      }
    },
    bounds: {
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
      configureAxis: (axis) => axis.tickFormat((v) => v),
      // configureAxis: (axis) => axis.tickFormat(format('.3d'))
    },
    y: {
      title: 'Consumption'
    },
    zoom: {
      in: 20,
      out: 1
    }
  }

  const chartWindow = select(selector).append('div')
  const renderer = new LineChart(chartWindow, data)
  renderer.addCustomListener('resize.custom', (event, data) => {
    // chooseResponsiveData(event.target, data)
  })
  renderer.buildChart()
}

