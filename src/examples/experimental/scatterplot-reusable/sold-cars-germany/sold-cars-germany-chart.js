import * as d3 from '../libs/d3-7.6.0/d3.js'
import {ScatterPlot} from '../libs/respvis/respvis.js'
import {carData, getTopMakesData} from './data/sold-cars-germany.js';
import {chooseResponsiveData} from "./chooseResponsiveData.js";
import {format} from "../libs/d3-7.6.0/d3.js";
// import {AxisArgs, Legend, Point, ScaleAny, ScaleContinuous, SeriesConfigTooltips} from "../../../../lib";


export function createChartSoldCarsGermany(selector) {
  const {topMakesNames, mileages, horsePower, prices} = getTopMakesData(5)
  const allHorsePower = carData.map(entry => entry.hp)
  const allPrices = carData.map(entry => entry.price)
  const allMileages = carData.map(entry => entry.mileage)

  const baseScaleX = d3.scaleLinear()
    .domain([0, Math.max(...allHorsePower)])
    .nice()
  const baseScaleY = d3.scaleLinear()
    .domain([0, Math.max(...allPrices)])
    .nice()
  const radiusScale = d3.scaleLinear()
    .domain([0, Math.max(...allMileages)])
    .range([5, 20])

  const scales = {
    xScale: baseScaleX,
    yScale: baseScaleY,
    radiusScale
  }


  const data = {
    x: {
      values: horsePower,
      scale: scales.xScale,
      // title: 'Price [EU]',
      title: {
        dependentOn: 'width',
        tuples: [[0, 'Price'], [1, 'Price [EU]'], [2, 'Price [EU] Long']]
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
      scale: scales.yScale,
      title: 'Horse Power [PS]'
    },
    title: "Car Characteristics",
    radiuses: {
      radiusDim: mileages,
      scale: scales.radiusScale
    },
    legend: {
      title: 'Legend',
      keys: [...topMakesNames, "Other"],
      labels: [...topMakesNames, "Other"]
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
  renderer.buildWindowChart()
}
