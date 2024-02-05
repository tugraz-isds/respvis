import {
  desktop,
  desktopCategory,
  phone,
  phoneCategory,
  tablet,
  tabletCategory,
  years
} from './data/desktop-phone-tablet.js';
import * as d3 from './libs/d3-7.6.0/d3.js'
import {BarChart, BarChartUserArgs} from './libs/respvis/respvis.js';

export function renderStackedBarChart(selector: string) {
  const yearsWhole = [...years, ...years, ...years]
  const sharesWhole = [...desktop, ...phone, ...tablet]
  const platformsWhole = [...desktopCategory, ...phoneCategory, ...tabletCategory]
  const calcData = () => {
    return {
      categoryEntity: 'Years',
      categories: years,
      values: desktop.map((d, i) => [desktop[i], phone[i], tablet[i]]),
      valuesAsRatios: true,
      valueDomain: [0, 100],
      subcategoryEntity: 'Platform',
      // subcategories: platforms,
      labels: {},
      legend: {reverse: true},
      tooltips: (e, {category, subcategory, value}) =>
        `Year: ${category}<br/>Platform: ${subcategory}<br/>Market Share: ${d3.format('.2f')(
          value
        )}%`,
      xAxis: {
        title: 'Year'
      },
      yAxis: {
        title: 'Market Share',
        configureAxis: (a) => a.tickFormat((v) => `${v}%`),
      }
    };
  }

  const tickOrientationHorizontal = {
    scope: 'self',
    dependentOn: 'width',
    mapping: {0: 90, 3: 0} //{0: 90, 1: -180, 3: 179} // demonstration purposes
  } as const
  const tickOrientationVertical = {
    scope: 'self',
    dependentOn: 'height',
    mapping: {0: 0, 3: 90} //{0: -180, 1: -180, 3: 179} // demonstration purposes
  } as const
  const axisBoundsWidth = {
    values: [10, 30, 50],
    unit: 'rem'
  } as const
  const axisBoundsHeight = {
    values: [10, 20, 30],
    unit: 'rem'
  } as const
  const barChartArgs: BarChartUserArgs = {
    series: {
      type: 'stacked',
      x: { values: yearsWhole },
      y: { values: sharesWhole },
      categories: {
        values: platformsWhole,
        title: 'Platforms'
      },
      markerTooltips: {
        tooltips: ((e, d) => {
          return `Site: ${d.xValue}<br/>
                Total Remuneration: $${d3.format(',')(d.yValue)}<br/>
                Year: ${d.label}<br/>`
        })
      },
      flipped: {
        dependentOn: 'width',
        mapping: {0: true, 2: false}
      },
    },
    bounds: {
      width: {
        values: [20, 30, 50],
        unit: 'rem'
      }
    },
    legend: {
      title: 'Year'
    },
    // title: {
    //   dependentOn: 'width',
    //   mapping: {0: 'Population of Austria', 2: 'Population of Austrian Cities'},
    // },
    x: {
      title: 'Country',
      bounds: {
        width: axisBoundsWidth,
        height: axisBoundsHeight
      },
      // tickOrientation: tickOrientationHorizontal,
      // tickOrientationFlipped: tickOrientationVertical
    },
    y: {
      title: 'Total Remuneration',
      subTitle: '[EU]',
      bounds: {
        height: axisBoundsHeight,
        width: axisBoundsWidth
      },
      // tickOrientation: tickOrientationVertical,
      tickOrientationFlipped: tickOrientationHorizontal,
      // configureAxis: (axis) => axis.tickFormat(d3.format('.2s')),
    },
    // zoom: { //TODO: make stacked bar chart work with zooming!
    //   in: 20,
    //   out: 1
    // }
  }

  const chartWindow = d3.select(selector).append('div')
  const renderer = new BarChart(chartWindow, barChartArgs)
  renderer.addCustomListener('resize.custom', (event, data) => {
    // chooseResponsiveData(event.target, data)
  })
  renderer.buildChart()
}
