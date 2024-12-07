import {BarChart, BarChartUserArgs, layouterCompute} from './libs/respvis/respvis.js';
import {compensations, sites, years} from './data/compensation-employees.js';
import * as d3 from './libs/d3-7.6.0/d3.js'

/**
 * Render Function of a Grouped Bar Chart
 * @param selector The selector for querying the wrapper of the Grouped Bar Chart
 */
export function renderGroupedBarChart(selector: string) {
  // horizontal breakpoints for x-axis (y-axis when flipped).
  // must be specified in ascending order and have same unit
  const axisBreakPointsWidth = {
    values: [10, 30, 50],
    unit: 'rem'
  } as const

  // using BarChartUserArgs provides type support
  const barChartArgs: BarChartUserArgs = {
    breakpoints: {
      width: {
        values: [20, 45, 50],        // chart breakpoints
        unit: 'rem'
      }
    },

    series: {
      type: 'grouped',
      x: { values: sites },          // array of strings for x values
      y: { values: compensations },  // array of numbers for y values
      categories: {
        title: 'Years',              // used to label the category
        values: years                // array of strings for categories
      },

      // callback function returning tooltip when bar hovered
      markerTooltipGenerator: ((e, d) => {
        return `Site: ${d.xValue}<br/>
                Total Remuneration: $${d3.format(',')(d.yValue)}<br/>
                Year: ${d.categoryFormatted ?? ''}<br/>`
      }),

      // at which layout widths bar chart is flipped
      flipped: {
        dependentOn: 'width',
        mapping: {0: true, 2: false}  // flipped when < 45 rem
      },

      // maximum scale factors for zooming in and out
      zoom: {
        in: 20,
        out: 1
      },

      // content and position of bar labels
      labels: {
        values: compensations.map(comp => d3.format('.2s')(comp)),
        offset: 6, positionStrategy: 'dynamic'
      }
    },

    legend: {
      title: 'Year'
    },

    x: {
      title: 'Country',
      breakpoints: {
        width: axisBreakPointsWidth,
      },
    },

    y: {
      title: 'Total Remuneration',
      subTitle: '[EU]',
      breakpoints: {
        width: axisBreakPointsWidth
      },

      // orientation of y-axis tick labels, if y-axis is flipped
      // rotation is interpolated between 0° (wide) and 90° (narrow)
      tickOrientationFlipped: {
        scope: 'self',
        dependentOn: 'width',
        breakpointValues: {0: 90, 2: 0}
      },

      // tick formatting for different chart widths
      configureAxis: {
        dependentOn: 'width',
        scope: 'chart',
        mapping: {0: (axis) => axis.tickFormat(d3.format('.2s')),
          3: (axis) => axis.tickFormat()}
      },
    }
  }

  // append empty div for chart window and create new chart instance
  const chartWindow = d3.select(selector).append('div')
  const renderer = new BarChart(chartWindow, barChartArgs)
  renderer.buildChart()

  const itemHover = () => {
    layouterCompute(renderer.layouterS)      // legend items grow on hover
    renderer.render()                        // recompute layout
  }

  chartWindow.selectAll('.legend-item')
    .on('mouseenter', itemHover)
    .on('mouseleave', itemHover)
}
