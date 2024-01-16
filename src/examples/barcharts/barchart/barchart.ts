import {
  chartWindowBarData,
  chartWindowBarAutoFilterCategories,
  chartWindowBarRender,
} from './libs/respvis/respvis.js';
import * as d3 from './libs/d3-7.6.0/d3.js'
import data from './data/austrian-cities.js';
import {chooseResponsiveData} from "./chooseResponsiveData.js";

export function createBarCart(selector: string) {
  const tickOrientation = {
    bounds: [ {minWidth: '40rem'}, {minWidth: '15rem'} ],
    orientation: ['horizontal', 'transition', 'vertical'],
    rotationDirection: 'counterclockwise'
  }

  const chartWindowData = {
    categoryEntity: 'Cities',
    categories: data.cities,
    values: data.populations,
    tooltips: (_, {category, value}) => `City: ${category}<br/>Population: ${value}`,
    xAxis: {
      title: 'City',
      tickOrientation
    },
    yAxis: {
      title: 'Population',
      tickOrientation,
      configureAxis: (axis) => axis.tickFormat(d3.format('.2s'))},
    labels: {},
  }

  const chartWindow = d3
    .select(selector)
    .append('div')
    .datum(chartWindowBarData(chartWindowData))
    .call(chartWindowBarAutoFilterCategories(chartWindowData))
    .on('resize', function (s, d) {
      chooseResponsiveData(document.documentElement, d)
      chartWindow.datum(chartWindowBarData(d)).call(chartWindowBarRender);
    })
    .call(chartWindowBarRender);
}

