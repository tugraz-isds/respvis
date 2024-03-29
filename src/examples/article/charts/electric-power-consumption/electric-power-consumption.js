import { select } from '../../libs/d3-7.6.0/d3.js'
import {
    chartWindowLineData,
    chartWindowLineRender,
    chartWindowLineAutoResize,
} from '../../libs/respvis/respvis.js';

import {mapPowerConsumptionData} from './data/electricPowerConsumption.js'
import {chooseResponsiveData} from "./chooseResponsiveData.js";

const { yUSA, yEurope, yAsia } = mapPowerConsumptionData()
const xValues = Array.from({length: 2014 - 1971 + 1}, (value, index) => (1971 + index).toString())

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
        chooseResponsiveData(d, e.target)
        chart.datum(chartWindowLineData(d)).call(chartWindowLineRender);
    })
