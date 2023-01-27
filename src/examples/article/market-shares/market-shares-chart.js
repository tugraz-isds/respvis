import {
    chartWindowBarStackedData,
    chartWindowBarStackedRender,
    chartWindowBarStackedAutoFilterCategories,
    chartWindowBarStackedAutoFilterSubcategories,
} from '../../libs/respvis/respvis.js';
import { years, desktop, phone, tablet, platforms } from '../../data/desktop-phone-tablet.js';
import * as d3 from '../../libs/d3-7.6.0/d3.js'

const shares = desktop.map((d, i) => [desktop[i], phone[i], tablet[i]]);

const data = {
    title:  "Market Shares of Browsers",
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

function chooseTickFormat() {
    if (window.matchMedia('(min-width: 60rem)').matches) return (v) => v
    if (window.matchMedia('(max-width: 51.9375rem)').matches && window.matchMedia('(min-width: 43.75rem)').matches) return (v) => v
    return (v) => `'${v.slice(-2)}`
}

const chartWindow = d3
    .select('#market-shares-chart')
    .append('div')
    .datum(chartWindowBarStackedData(data))
    .call(chartWindowBarStackedRender)
    .call(chartWindowBarStackedAutoFilterCategories(data))
    .call(chartWindowBarStackedAutoFilterSubcategories(data))
    .on('resize', function (e, d) {
        const hasSmallTitle = window.matchMedia('(max-width: 27.5rem)').matches
        const mediumWidth = window.matchMedia('(min-width: 40rem)').matches;
        const largeWidth = window.matchMedia('(min-width: 60rem)').matches;

        data.flipped = chooseDataFlipped()
        data.legend.title = mediumWidth ? 'Platforms' : ''
        const xTickFormat = chooseTickFormat()
        data.xAxis.configureAxis = (a) => a.tickFormat(xTickFormat);
        data.title = hasSmallTitle ? "M.S. Browsers" : "Market Shares of Browsers"

        chartWindow.datum(chartWindowBarStackedData(data)).call(chartWindowBarStackedRender);
    });

const chooseDataFlipped = () => {
    // if (window.matchMedia('(min-width: 25rem)').matches &&
    //     window.matchMedia('(max-width: 37.5rem)').matches) return true
    const firstChange = window.matchMedia('(min-width: 77rem)').matches
    if (firstChange || window.matchMedia('(max-width: 31.25rem)').matches ) return true
    return false
}
