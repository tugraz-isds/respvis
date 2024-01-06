import * as d3 from '../libs/d3-7.6.0/d3.js'
import {ScatterPlot, formatWithDecimalZero} from '../libs/respvis/respvis.js'
import {carData, getTopMakesData} from './data/sold-cars-germany.js';
import {chooseResponsiveData} from "./chooseResponsiveData.js";
import {format} from "../libs/d3-7.6.0/d3.js";
// import {AxisArgs, Legend, Point, ScaleAny, ScaleContinuous, SeriesConfigTooltips} from "../../../../lib";


export function createChartSoldCarsGermany(selector) {
  const {topMakesNames, mileages, horsePower, prices, makes} = getTopMakesData(5)
  // const topMakesArray = topMakesNames.map((name, i) => new Array(mileages[i].length).fill(name))

  // const allHorsePower = carData.map(entry => entry.hp)
  // const allPrices = carData.map(entry => entry.price)
  // const allMileages = carData.map(entry => entry.mileage)

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


  const data = {
    bounds: {
      width: {
        values: [20, 30, 50],
        unit: 'rem'
      }
    },
    title: {
      dependentOn: 'width',
      tuples: [[0, 'Car Chars.'], [1, 'Car Characteristics'], [3, 'Car Characteristics from AutoScout24 in Germany']]
    },
    x: {
      values: horsePower,
      scale: scales.xScale,
      title: {
        dependentOn: 'width',
        tuples: [[0, 'HP in [PS]'], [1, 'Horse P. [PS]'], [2, 'Horse Power in [PS]']]
      },
      bounds: {
        width: {
          values: [10, 30, 50],
          unit: 'rem'
        }
      },
      configureAxis: (axis) => axis.tickFormat(format('.3d'))
    },
    y: {
      values: prices,
      categories: makes,
      scale: scales.yScale,
      title: 'Car Price [EU]',
      configureAxis: {
        dependentOn: 'width',
        scope: 'chart',
        tuples: [[0, (axis) => axis.tickFormat(formatWithDecimalZero(format('.2s')))],
          [2, (axis) => axis.tickFormat(formatWithDecimalZero(format(',')))]]
      }
    },
    radiuses: {
      radiusDim: mileages,
      scale: scales.radiusScale
    },
    legend: {
      title: {
        dependentOn: 'width',
        scope: 'chart',
        tuples: [[0,''], [[3], 'Legend']]
      },
      keys: [...topMakesNames, "Other"],
      labels: [...topMakesNames, "Other"]
    },
    zoom: {
      in: 20,
      out: 1
    },
    markerTooltips: {
      tooltips: ((e, d) => `Car Price: ${d.yValue}€<br/>Horse Power: ${d.xValue}PS`)
    }
  };

  //'#sold-cars-germany'
  const chartWindow = d3.select(selector).append('div')
  const renderer = new ScatterPlot(chartWindow, data)
  renderer.addCustomListener('resize.custom', (event, data) => {
    chooseResponsiveData(event.target, data)
  })
  renderer.buildWindowChart()
}
