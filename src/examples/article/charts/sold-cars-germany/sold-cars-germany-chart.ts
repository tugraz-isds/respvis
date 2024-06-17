import * as d3 from '../../libs/d3-7.6.0/d3.js'
import {formatWithDecimalZero, Point, ScatterPlot, ScatterPlotUserArgs} from '../../libs/respvis/respvis.js'
import {carData, getTopMakesData} from './data/sold-cars-germany.js';

export function createSoldCarsGermanyChart(selector: string) {
    const {mileages, horsePower, prices, makes} = getTopMakesData(5)
    const allHorsePower = carData.map(entry => entry.hp)
    const allPrices = carData.map(entry => entry.price)
    const allMileages = carData.map(entry => entry.mileage)

    // const horsePowerWithExtrema = [...horsePower, [0, 0, Math.max(...allHorsePower), Math.max(...allHorsePower)]]
    // const pricesWithExtrema = [...prices, [0, Math.max(...allPrices), 0, Math.max(...allPrices)]]
    // const mileagesWithExtrema = [...mileages, [Math.max(...allMileages), Math.max(...allMileages), Math.max(...allMileages), Math.max(...allMileages)]]

    const baseScaleX = d3.scaleLinear()
      .domain([0, Math.max(...allHorsePower)])
      .nice()
    const baseScaleY = d3.scaleLinear()
      .domain([0, Math.max(...allPrices)])
      .nice()
    const radiusScale = d3.scaleLinear()
      .domain([0, Math.max(...allMileages)])
      .range([5, 20])

    const data: ScatterPlotUserArgs = {
        series: {
            x: {
                values: horsePower,
                // values: horsePowerWithExtrema,
                scale: baseScaleX
            },
            y: {
                values: prices,
                // values: pricesWithExtrema,
                scale: baseScaleY
            },
            categories: {
                values: makes,
                title: 'Makes'
            },
            radii: {
                values: mileages,
                scale: {
                    dependentOn: 'width',
                    value: radiusScale,
                    mapping: {
                        0: s => s.range([3, 12]),
                        2: s => s.range([4, 16]),
                        3: s => s.range([5, 20])
                    }
                },
            },
            markerTooltipGenerator: ((e, d: Point) => {
                return `Car Price: ${d.yValue}€<br/>
                Horse Power: ${d.xValue}PS<br/>
                Make: ${d.categoryFormatted ?? ''}<br/>
                Mileage: ${d.radiusValue}km<br/>`
            }),
            zoom: {
                in: 20,
                out: 1
            }
        },
        breakPoints: {
            width: {
                values: [40, 60],
                unit: 'rem'
            }
        },
        title: {
            dependentOn: 'width',
            mapping: {0 : 'Car Characteristics', 2: 'Car Characteristics from AutoScout24 in Germany'}
        },
        x: {
            title: {
                dependentOn: 'width',
                scope: 'self',
                mapping: {0: 'HP in [PS]', 1: 'Horse P. [PS]', 2: 'Horse Power in [PS]'}
            },
            breakPoints: {
                width: {
                    values: [10, 30, 50],
                    unit: 'rem'
                }
            },
            configureAxis: (axis) => axis.tickFormat(d3.format('.3d'))
        },
        y: {
            title: 'Car Price [EU]',
            configureAxis: {
                dependentOn: 'width',
                scope: 'chart',
                mapping: {0: (axis) => axis.tickFormat(formatWithDecimalZero(d3.format('.2s'))),
                    2: (axis) => axis.tickFormat(formatWithDecimalZero(d3.format(',')))
                }
            }
        },
        legend: {
            title: {
                dependentOn: 'width',
                scope: 'chart',
                mapping: {0: '', 1: 'Legend'}
            },
        }
    }

    const chartWindow = d3.select(selector).append('div')
    const renderer = new ScatterPlot(chartWindow, data)
    renderer.buildChart()
}
