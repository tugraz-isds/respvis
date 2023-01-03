import { select, format} from '../vendor/d3-7.6.0/d3.js'
import {
    chartWindowLineData,
    chartWindowLineRender,
    chartWindowLineAutoResize,
} from '../../moduleInJs/respvis.js'

import data from '../data/electric-power-consumption/electricPowerConsumption.js'

const usaData = data.filter(obj => obj["Country Name"] === "United States")[0]
const europeData = data.filter(obj => obj["Country Name"] === "European Union")[0]
const asiaData = data.filter(obj => obj["Country Name"] === "East Asia & Pacific")[0]

const xValues = Array.from({length: 2014 - 1971 + 1}, (value, index) => (1971 + index).toString())

const yUSA = xValues.map(year => usaData[year])
const yEurope = xValues.map(year => europeData[year])
const yAsia= xValues.map(year => asiaData[year])

const chartData = {
    xValues: xValues,
    yValues: [yAsia, yUSA, yEurope],
    xAxis: { title: 'Years' },
    yAxis: { title: 'Consumption' },
    markerTooltips: {
        tooltips: (_, { xValue, yValue }) => `Year: ${xValue}<br/>Pow. Consumption: ${yValue}kWh`
    },
    legend: {
        title: 'Legend',
        keys: ['East Asia', 'USA', 'Europe'],
        labels: ['East Asia', 'USA', 'Europe'],
    }

}

const chart = select('#electric-power-consumption')
    .append('div')
    .datum(chartWindowLineData(chartData))
    .call(chartWindowLineRender)
    .call(chartWindowLineAutoResize)
    .on('resize', () => {

        const mediumWidth = window.matchMedia('(min-width: 400px)').matches && window.matchMedia('(min-width: 400px)').matches;
        const largeWidth = window.matchMedia('(min-width: 700px)').matches;
        const minWidth = window.matchMedia('(max-width: 400px)').matches;

        chartData.title = chooseTitle()

        const priceTickFormat = largeWidth ? format(',') : format('.2s');
        chartData.yAxis.configureAxis = (axis) => axis.tickFormat(priceTickFormat);
        chartData.xAxis.configureAxis = (axis) => axis.tickFormat(chooseXTickFormat());

        chart.datum(chartWindowLineData(chartData)).call(chartWindowLineRender);
    })

const chooseTitle = () => {
    const smallTitle = 'Pow. Cons.'
    const middleTitle = 'Power Consumption (kWh)'
    const largeTitle = 'Electric power consumption (kWh per capita)'
    if (window.matchMedia('(max-width: 440px)').matches ||
        window.matchMedia('(min-width: 1100px)').matches) return smallTitle
    // if (window.matchMedia('(min-width: 600px)').matches) return largeTitle
    return middleTitle
}

const chooseXTickFormat = () => {
    if (window.matchMedia('(min-width: 550px)').matches &&
        window.matchMedia('(max-width: 700px)').matches) return (v) => v
    return (v) => `'${v.slice(-2)}`
}
