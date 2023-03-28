import {
    chartWindowBarStackedData,
    chartWindowBarStackedRender,
    chartWindowBarStackedAutoFilterCategories,
    chartWindowBarStackedAutoFilterSubcategories
} from '../../libs/respvis/respvis.js';
import { chooseAxisFormat } from "./chooseAxisFormat.js";
import { chooseResponsiveData } from "./chooseResponsiveData.js";
import { years, desktop, phone, tablet, platforms } from '../../data/desktop-phone-tablet.js';
import * as d3 from '../../libs/d3-7.6.0/d3.js'

const shares = desktop.map((d, i) => [desktop[i], phone[i], tablet[i]]);

const calcData = () => { //data for sufficient space
    return {
        title: "Market Shares of Browsers",
        categoryEntity: 'Years',
        categories: years,
        values: shares,
        valuesAsRatios: true,
        valueDomain: [0, 100],
        subcategoryEntity: 'Platforms',
        subcategories: platforms,
        labels: {},
        legend: {
            title: 'Platforms'
        },
        tooltips: (e, { category, subcategory, value }) =>
            `Year: ${category}<br/>Platform: ${subcategory}<br/>Market Share: ${d3.format('.2f')(
                value
            )}%`,
        xAxis: {
            title: 'Year',
            configureAxis: (a) => a.tickFormat((v) => v)
        },
        yAxis: {
            title: 'Market Share',
            configureAxis: (a) => a.tickFormat((v) => `${v}%`),
        },
    };
}

const data = calcData()

const chartWindow = d3
    .select('#market-shares-chart')
    .append('div')
    .datum(chartWindowBarStackedData(data))
    .call(chartWindowBarStackedRender)
    .call(chartWindowBarStackedAutoFilterCategories(data))
    .call(chartWindowBarStackedAutoFilterSubcategories(data))
    .on('resize', function (e, d) {
        const data = calcData()
        chooseResponsiveData(data, e.target)

        const xAxisE = d3.select('#market-shares-chart').select('.axis-x').node()
        chooseAxisFormat(xAxisE, data)

        chartWindow.datum(chartWindowBarStackedData(data)).call(chartWindowBarStackedRender);
    });

/*
* chart Orientation:
*
* Long:
* Legend on Right / Legend With Title / Years at Bottom / Percent at Left
*
* Middle:
* Legend on Right / Legend With Title / Years at Bottom + Shortened / Percent at Left
*
* Short:
* Legend on Top / Legend Without Title / Years at Left / Percent at Bottom
*
* */
