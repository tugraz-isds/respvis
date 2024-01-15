import * as d3 from '../libs/d3-7.6.0/d3.js'
import {ScatterPlot, formatWithDecimalZero} from '../libs/respvis/respvis.js'
import {getTopMakesData} from './data/sold-cars-germany.js';
import {chooseResponsiveData} from "./chooseResponsiveData.js";
import {format} from "../libs/d3-7.6.0/d3.js";
import {ChartPointUserArgs} from "../../../../lib";
// import {AxisArgs, Legend, Point, ScaleAny, ScaleContinuous, SeriesConfigTooltips} from "../../../../lib";


export function createChartSoldCarsGermany(selector) {
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


  const data: ChartPointUserArgs = {
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
    radii: {
      values: mileages,
      scale: {
        dependentOn: 'width',
        value: scales.radiusScale,
        tuples: [[0, (s => s.range([3, 12]))],
          [2, (s) => s.range([4, 16])],
          [3,  (s) => s.range([5, 20])]]
      },
    },
    legend: {
      title: {
        dependentOn: 'width',
        scope: 'chart',
        tuples: [[0,''], [3, 'Legend']]
      },
      // labelCallback: (label: string) => {
      //   console.log(label)
      //   return label + '1'
      // }
    },
    zoom: {
      in: 20,
      out: 1
    },
    markerTooltips: {
      tooltips: ((e, d) => {
        return `Car Price: ${d.yValue}€<br/>
Horse Power: ${d.xValue}PS<br/>
Make: ${d.label}<br/>
Mileage: ${d.radiusValue}km<br/>`
      })
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
