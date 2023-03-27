import {
    chartWindowBarStackedData,
    chartWindowBarStackedRender,
    chartWindowBarStackedAutoFilterCategories,
    chartWindowBarStackedAutoFilterSubcategories,
    findMatchingBoundsIndex
} from '../../libs/respvis/respvis.js';
import { years, desktop, phone, tablet, platforms } from '../../data/desktop-phone-tablet.js';
import * as d3 from '../../libs/d3-7.6.0/d3.js'

const shares = desktop.map((d, i) => [desktop[i], phone[i], tablet[i]]);

const responsiveData = [
    { maxWidth: '27.5rem' },
    { maxWidth: '40rem'},
    { minWidth: '40rem'},
]

function adaptResponsiveData(index, data) {
    switch (index) {
        case 0: adapt0(); break
        case 1: adapt1(); break
        case 2: adapt2(); break
        default: adapt0()
    }
    function adapt0() {
        data.title = 'M.S. Browsers'
        data.flipped = true
        data.xAxis.configureAxis = (a) => a.tickFormat((v) => `'${v.slice(-2)}`);
    }
    function adapt1() {
        data.title = 'Market Shares of Browsers'
        data.flipped = true
        data.legend.title = 'Platforms'
        data.xAxis.configureAxis = (a) => a.tickFormat((v) => `'${v.slice(-2)}`);
    }
    function adapt2() {
        data.title = 'Market Shares of Browsers'
        data.flipped = false
        data.legend.title = 'Platforms'
        data.xAxis.configureAxis = (a) => a.tickFormat((v) => v);
    }
}

const calcData = () => {
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
        legend: {},
        tooltips: (e, { category, subcategory, value }) =>
            `Year: ${category}<br/>Platform: ${subcategory}<br/>Market Share: ${d3.format('.2f')(
                value
            )}%`,
        xAxis: {
            title: 'Year',
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
        const index = findMatchingBoundsIndex(e.target, responsiveData)
        const data = calcData()
        adaptResponsiveData(index, data)
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
