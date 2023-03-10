import {PointChartRenderer} from '../../libs/respvis/respvis.js'
import {carData, getTopMakesData} from '../../data/sold-cars-germany/sold-cars-germany.js';
import * as d3 from '../../libs/d3-7.6.0/d3.js'

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
    xValues: horsePower,
    xScale: scales.xScale,
    yValues: prices,
    yScale: scales.yScale,
    xAxis: { title: 'Price [EU]' },
    yAxis: { title: 'Horse Power [PS]' },
    title: "Cars Sold in Germany",
    subtitle: "From 2011 to 2021",
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

const chartWindow = d3.select('#sold-cars-germany').append('div')
const renderer = new PointChartRenderer(chartWindow, data)
renderer.addCustomListener('resize.custom', (selection, data) => {
    const mediumWidth = window.matchMedia('(min-width: 40rem)').matches;
    const largeWidth = window.matchMedia('(min-width: 60rem)').matches;
    const numberFormat = !mediumWidth ? d3.format('.2s') : d3.format(',');
    data.xAxis.configureAxis = (a) => a.tickFormat(numberFormat);
    data.yAxis.configureAxis = (a) => a.tickFormat(numberFormat);
    renderer.data = data
})

renderer.buildWindowPointChart()


