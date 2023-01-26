import { chartWindowPointData, chartWindowPointRender, rectFromString } from '../../libs/respvis/respvis.js'
import carData from '../../data/sold-cars-germany/sold-cars-germany.js';
import * as d3 from '../../libs/d3-7.6.0/d3.js'

const prices = carData.map(car => car.price)
const horsePower = carData.map(car => car.hp)


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
    xAxis: { title: 'Price', subtitle: '[EU]' },
    yAxis: { title: 'Horse Power', subtitle: '[PS]' },
    title: "Sample of Sold Cars in Germany"
};

const render = (cW) => cW.datum(chartWindowPointData(data)).call(chartWindowPointRender);

const chartWindow = d3.select('#sold-cars-germany').append('div').call(render);

const zoom = d3.zoom();
const drawArea = chartWindow.selectAll('.draw-area').call(
    zoom.scaleExtent([1, 20]).on('zoom', function (e, d) {
        data.xScale = e.transform.rescaleX(areaScale);
        data.yScale = e.transform.rescaleY(priceScale);
        chartWindow.call(render);
    })
);

chartWindow.on('resize', function () {
    // const { width, height } = rectFromString(drawArea.attr('bounds'));
    // const extent = [
    //     [0, 0],
    //     [width, height],
    // ];
    // zoom.extent(extent).translateExtent(extent);
    //
    // const mediumWidth = window.matchMedia('(min-width: 40rem)').matches;
    // const largeWidth = window.matchMedia('(min-width: 60rem)').matches;
    // const numberFormat = !mediumWidth ? d3.format('.2s') : d3.format(',');
    // data.xAxis.configureAxis = data.yAxis.configureAxis = (a) => a.tickFormat(numberFormat);
    // data.radiuses = !mediumWidth ? 3 : !largeWidth ? 5 : 7;
    // chartWindow.call(render);
});
