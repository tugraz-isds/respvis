import {ParcoordChart, ParcoordChartUserArgs} from './libs/respvis/respvis.js';
import * as d3 from './libs/d3-7.6.0/d3.js'
import {getTopMakesData} from "./data/sold-cars-germany.js";

// import {chooseResponsiveData} from "./chooseResponsiveData.js";

export function renderParcoord(selector: string) {
  const {horsePower, prices, mileages, makes} = getTopMakesData(5)

  // const hpScale = d3.scaleLinear()
  //   .domain([0, Math.max(...allHorsePower)])
  //   .nice()
  // const priceScale = d3.scaleLinear()
  //   .domain([0, Math.max(...allPrices)])
  //   .nice()
  // const mileageScale = d3.scaleLinear()
  //   .domain([0, Math.max(...allMileages)])
  //   .range([5, 20])

  const data: ParcoordChartUserArgs = {
    series: {
      dimensions: [
        {
          scaledValues: { values: horsePower},
          axis: {
            title: "Horsepower",
            subTitle: "[PS]"
          }
        },
        {
          scaledValues: { values: prices},
          axis: {
            title: "Price",
            subTitle: "[EU]"
          }
        },
        {
          scaledValues: { values: mileages},
          axis: {
            title: "Mileage",
            subTitle: "[km]"
          }
        },
      ],
      categories: {
        values: makes,
        title: 'Makes'
      }
    },
    bounds: {
      width: {
        values: [20, 30, 50],
        unit: 'rem'
      }
    },
    title: 'Car data'
  }

  const chartWindow = d3.select(selector).append('div')
  const renderer = new ParcoordChart(chartWindow, data)
  renderer.addCustomListener('resize.custom', (selection, data) => {
    // chooseResponsiveData(document.documentElement, data)
  })
  renderer.buildChart()
}
