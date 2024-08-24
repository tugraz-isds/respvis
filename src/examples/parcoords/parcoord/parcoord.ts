import {formatWithDecimalZero, ParcoordChart, ParcoordChartUserArgs} from './libs/respvis/respvis.js';
import * as d3 from './libs/d3-7.6.0/d3.js'
import {getTopMakesData} from "./data/sold-cars-germany.js";

export function renderParcoord(selector: string) {
  const {horsePower, prices, mileages, makes, fuel} = getTopMakesData(5)

  const sharedAxisConfig = {
    dependentOn: 'width',
    scope: 'chart',
    mapping: {
      0: (axis: d3.Axis<d3.AxisDomain>) => axis.tickFormat(formatWithDecimalZero(d3.format('.2s'))),
      3: (() => {
      })
    }
  } as const

  const sharedTickOrientationFlipped = {
    dependentOn: 'width',
    breakpointValues: {0: 90, 2: 0}
  } as const

  const sampleSize = 500

  const data: ParcoordChartUserArgs = {
    title: 'Car data',
    breakpoints: {
      width: {
        values: [20, 30, 50],
        unit: 'rem'
      }
    },
    series: {
      dimensions: [
        {
          scaledValues: {values: horsePower.slice(0, sampleSize)},
          zoom: {
            in: 10,
            out: 1
          },
          axis: {
            title: "Horsepower",
            subTitle: "[PS]",
            tickOrientationFlipped: sharedTickOrientationFlipped
          }
        },
        {
          scaledValues: {values: prices.slice(0, sampleSize)},
          zoom: {
            in: 20,
            out: 1
          },
          axis: {
            title: "Price",
            subTitle: "[EU]",
            configureAxis: sharedAxisConfig,
            tickOrientationFlipped: sharedTickOrientationFlipped
          }
        },
        {
          scaledValues: {values: mileages.slice(0, sampleSize)},
          zoom: {
            in: 20,
            out: 1
          },
          axis: {
            title: "Mileage",
            subTitle: "[km]",
            configureAxis: sharedAxisConfig,
            tickOrientationFlipped: sharedTickOrientationFlipped
          }
        },
        {
          scaledValues: {values: fuel.slice(0, sampleSize)},
          axis: {
            title: "Fuel",
            tickOrientationFlipped: sharedTickOrientationFlipped
          }
        },
      ],
      categories: {
        values: makes.slice(0, sampleSize),
        title: 'Makes'
      },
      flipped: {
        mapping: {0: true, 3: false},
        dependentOn: 'width'
      }
    },
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
          scaledValues: {values: horsePoserGeneralized},
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
          scaledValues: {values: mileagesGeneralized},
          axis: {
            title: "Mileage",
            subTitle: "[km]"
          }
        },
        {
          scaledValues: {values: fuel},
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
    breakpoints: {
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
