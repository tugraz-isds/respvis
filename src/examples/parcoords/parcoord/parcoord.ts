import {ParcoordChart, ParcoordChartUserArgs} from './libs/respvis/respvis.js';
import * as d3 from './libs/d3-7.6.0/d3.js'
import {getTopMakesData} from "./data/sold-cars-germany.js";

export function renderParcoord(selector: string) {
  const {horsePower, prices, mileages, makes, fuel} = getTopMakesData(5)

  const data: ParcoordChartUserArgs = {
    series: {
      dimensions: [
        {
          scaledValues: { values: horsePower},
          zoom: {
            in: 10,
            out: 1
          },
          axis: {
            title: "Horsepower",
            subTitle: "[PS]"
          }
        },
        {
          scaledValues: {
            values: prices
          },
          zoom: {
            in: 20,
            out: 1
          },
          axis: {
            title: "Price",
            subTitle: "[EU]"
          }
        },
        {
          scaledValues: { values: mileages},
          zoom: {
            in: 20,
            out: 1
          },
          axis: {
            title: "Mileage",
            subTitle: "[km]"
          }
        },
        {
          scaledValues: { values: fuel},
          axis: {
            title: "Fuel",
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
  renderer.buildChart()
}

export function renderParcoordGeneralized(selector: string) {
  const {horsePower, prices, mileages, makes, fuel} = getTopMakesData(5)
  //
  const horsePoserGeneralized = horsePower.map(hp => {
    return hp > 0 && hp < 220 ? '0-220' :
      hp > 220 && hp < 440 ? '221-440' : '>441'
  })

  const priceGeneralized = prices.map(price => {
    return price > 0 && price < 80000 ? '0-80000' :
      price > 80000 && price < 160000 ? '80001-160000' : '>160000'
  })

  const mileagesGeneralized = mileages.map(mileage => {
    return mileage > 0 && mileage < 100000 ? '0-100000' :
      mileage > 100000 && mileage < 200000 ? '100001-200000' :
      mileage > 200000 && mileage < 300000 ? '200001-300000' : '>300000'
  })

  const data: ParcoordChartUserArgs = {
    series: {
      dimensions: [
        {
          scaledValues: { values: horsePoserGeneralized},
          axis: {
            title: "Horsepower",
            subTitle: "[PS]"
          }
        },
        {
          scaledValues: {
            values: priceGeneralized
          },
          axis: {
            title: "Price",
            subTitle: "[EU]"
          }
        },
        {
          scaledValues: { values: mileagesGeneralized},
          axis: {
            title: "Mileage",
            subTitle: "[km]"
          }
        },
        {
          scaledValues: { values: fuel},
          axis: {
            title: "Fuel",
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
  renderer.buildChart()
}
