import {
    chartWindowBarStackedData,
    chartWindowBarStackedRender,
    chartWindowBarStackedAutoFilterCategories,
    chartWindowBarStackedAutoFilterSubcategories,
} from '../libs/respvis/respvis.js';
import { years, desktop, phone, tablet, platforms } from '../data/desktop-phone-tablet.js';
import * as d3 from '../libs/d3-7.6.0/d3.js'

const shares = desktop.map((d, i) => [desktop[i], phone[i], tablet[i]]);

const data = {
    title: 'Market Shares of Browsers',
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

const chartWindow = d3
    .select('#electric-power-consumption2')
    .append('div')
    .datum(chartWindowBarStackedData(data))
    .call(chartWindowBarStackedRender)
    .call(chartWindowBarStackedAutoFilterCategories(data))
    .call(chartWindowBarStackedAutoFilterSubcategories(data))
    .on('resize', function (e, d) {
        const mediumWidth = window.matchMedia('(min-width: 40rem)').matches;
        const largeWidth = window.matchMedia('(min-width: 60rem)').matches;

        data.flipped = !mediumWidth;
        data.legend.title = mediumWidth ? 'Platforms' : '';
        const xTickFormat = largeWidth ? (v) => v : (v) => `'${v.slice(-2)}`;
        data.xAxis.configureAxis = (a) => a.tickFormat(xTickFormat);

        /* const legendPosition = d.flipped
            ? respVis.LegendPosition.Top
            : respVis.LegendPosition.Right;
          chart.call(chartLegendPosition, legendPosition); */

        chartWindow.datum(chartWindowBarStackedData(data)).call(chartWindowBarStackedRender);
    });
