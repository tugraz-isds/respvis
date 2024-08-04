import {BarChart, BarChartUserArgs, layouterCompute} from './libs/respvis/respvis.js';
import {compensations, sites, years} from './data/compensation-employees.js';
import * as d3 from './libs/d3-7.6.0/d3.js'

export function renderGroupedBarChart(selector: string) {
  const tickOrientationHorizontal = {
    scope: 'self',
    dependentOn: 'width',
    breakpointValues: {0: 90, 2: 0} //{0: 90, 1: -180, 3: 179} // demonstration purposes
  } as const
  const axisBreakPointsWidth = {
    values: [10, 30, 50],
    unit: 'rem'
  } as const
  const axisBreakPointsHeight = {
    values: [10, 20, 30],
    unit: 'rem'
  } as const
  const barChartArgs: BarChartUserArgs = {
    series: {
      type: 'grouped',
      x: { values: sites },
      y: { values: compensations },
      categories: {
        values: years,
        title: 'Years'
      },
      markerTooltipGenerator: ((e, d) => {
        return `Site: ${d.xValue}<br/>
                Total Remuneration: $${d3.format(',')(d.yValue)}<br/>
                Year: ${d.categoryFormatted ?? ''}<br/>`
      }),
      flipped: {
        dependentOn: 'width',
        mapping: {0: true, 2: false}
      },
      zoom: {
        in: 20,
        out: 1
      },
      labels: {
        values: compensations.map(comp => d3.format('.2s')(comp)),
        offset: 6, positionStrategy: 'dynamic'
      }
    },
    breakpoints: {
      width: {
        values: [20, 45, 50],
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
      breakpoints: {
        width: axisBreakPointsWidth,
        height: axisBreakPointsHeight
      },
      // verticalLayout: 'right',
      // tickOrientation: tickOrientationHorizontal,
      // tickOrientationFlipped: tickOrientationVertical
    },
    y: {
      title: 'Total Remuneration',
      subTitle: '[EU]',
      breakpoints: {
        height: axisBreakPointsHeight,
        width: axisBreakPointsWidth
      },
      // tickOrientation: tickOrientationVertical,
      tickOrientationFlipped: tickOrientationHorizontal,
      configureAxis: {
        dependentOn: 'width',
        scope: 'chart',
        mapping: {0: (axis) => axis.tickFormat(d3.format('.2s')), 3: (axis) => axis.tickFormat()}
      },
    }
  }

  const chartWindow = d3.select(selector).append('div')
  const renderer = new BarChart(chartWindow, barChartArgs)
  renderer.buildChart()
  const itemHover = () => {
    layouterCompute(renderer.layouterS)
    renderer.render()
  }
  chartWindow.selectAll('.legend-item')
    .on('mouseenter', itemHover)
    .on('mouseleave', itemHover)
}
