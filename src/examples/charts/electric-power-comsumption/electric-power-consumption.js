import { select } from '../../libs/d3-7.6.0/d3.js'
import {
    chartWindowLineData,
    chartWindowLineRender,
    chartWindowLineAutoResize,
} from '../../libs/respvis/respvis.js';

import data from '../../data/electric-power-consumption/electricPowerConsumption.js'
import {chooseResponsiveData} from "./chooseResponsiveData.js";

const usaData = data.filter(obj => obj["Country Name"] === "United States")[0]
const europeData = data.filter(obj => obj["Country Name"] === "European Union")[0]
const asiaData = data.filter(obj => obj["Country Name"] === "East Asia & Pacific")[0]

const xValues = Array.from({length: 2014 - 1971 + 1}, (value, index) => (1971 + index).toString())

const yUSA = xValues.map(year => usaData[year])
const yEurope = xValues.map(year => europeData[year])
const yAsia= xValues.map(year => asiaData[year])

const calcData = () => {
    return {
        xValues: xValues,
        yValues: [yUSA, yEurope, yAsia],
        xAxis: {title: 'Year'},
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

const chart = select('#electric-power-consumption')
    .append('div')
    .datum(chartWindowLineData(calcData()))
    .call(chartWindowLineRender)
    .call(chartWindowLineAutoResize)
    .on('resize', (e, d) => {
        const data = calcData()
        chooseResponsiveData(data, e.target)
        chart.datum(chartWindowLineData(data)).call(chartWindowLineRender);
    })
