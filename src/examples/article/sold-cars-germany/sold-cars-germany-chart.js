import {
    chartWindowPointAutoResize,
    chartWindowPointData,
    chartWindowPointRender,
    rectFromString
} from '../../libs/respvis/respvis.js'
import carData from '../../data/sold-cars-germany/sold-cars-germany.js';
import * as d3 from '../../libs/d3-7.6.0/d3.js'

const prices = carData.map(car => car.price)
const horsePower = carData.map(car => car.hp)

function getUsedMakesSorted() {
    const usedMakes = carData.reduce((makes, car) => {
        const makeIndex = makes.findIndex(make => make.name === car.make)
        if (makeIndex === -1) {
            makes.push({name: car.make, count: 1})
            return makes
        }
        makes[makeIndex].count++
        return makes
    }, [])

    return usedMakes.sort((make1, make2) => {
        return make1.count > make2.count ? -1 : 1
    })
}

const usedMakesSorted = getUsedMakesSorted()
const topMakesNames = usedMakesSorted.slice(0, 5).map(topMake => topMake.name)


// const carsSorted = topMakesNames.map(topMake => {
//     return carData.filter(car => car.make === topMake)
// })
// carsSorted.push(carData.filter(car => !topMakesNames.includes(car.make)))
// const prices = carsSorted.map(carsOfMake => {
//     return carsOfMake.map(carOfMake => carOfMake.price)
// })
// const horsePowers = carsSorted.map(carsOfMake => {
//     return carsOfMake.map(carOfMake => carOfMake.hp)
// }) TODO: use these variables when respvis supports multiple categories for scatter plot

const hpScale = d3
    .scaleLinear()
    .domain([0, Math.max(...horsePower)])
    .nice();

const priceScale = d3
    .scaleLinear()
    .domain([0, Math.max(...prices)])
    .nice();


const data = {
    xValues: prices,
    xScale: priceScale,
    yValues: horsePower,
    yScale: hpScale,
    xAxis: { title: 'Price [EU]' },
    yAxis: { title: 'Horse Power [PS]' },
    title: "Cars Sold in Germany",
    subtitle: "From 2011 to 2021"
};

const render = (cW) => cW.datum(chartWindowPointData(data))
    .call(chartWindowPointRender)
    .call(chartWindowPointAutoResize);

const chartWindow = d3.select('#sold-cars-germany').append('div').call(render);

chartWindow.on('resize', function () {
    const mediumWidth = window.matchMedia('(min-width: 40rem)').matches;
    const largeWidth = window.matchMedia('(min-width: 60rem)').matches;
    const numberFormat = !mediumWidth ? d3.format('.2s') : d3.format(',');
    data.xAxis.configureAxis = data.yAxis.configureAxis = (a) => a.tickFormat(numberFormat);
    data.radiuses = !mediumWidth ? 3 : !largeWidth ? 5 : 7;
    chartWindow.call(render);
});
