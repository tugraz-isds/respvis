import {BarChart, BarChartUserArgs, layouterCompute} from './libs/respvis/respvis.js';
import {compensations, sites, years} from './data/compensation-employees.js';
import * as d3 from './libs/d3-7.6.0/d3.js'

/**
 * Render Function of a Grouped Bar Chart
 * @param selector The selector for querying the wrapper of the Grouped Bar Chart
 */
export function renderGroupedBarChart(selector: string) {
  // The breakpoints used by both axes, x and y
  // They must be specified in ascending order and have the same unit
  const axisBreakPointsWidth = {
    values: [10, 30, 50],
    unit: 'rem'
  } as const

  // By using the BarChartUserArgs type one gets type support
  // when defining the input for the bar chart
  const barChartArgs: BarChartUserArgs = {
    series: {
      // As soon as the series type is specified, type support is getting even more accurate
      type: 'grouped',
      // A string array is passed as x values. RespVis automatically calculates the required
      // spatial scale for positioning the values.
      x: { values: sites },
      // A number array is passed as y values. RespVis automatically calculates the required
      // spatial scale for positioning the values.
      y: { values: compensations },
      // A string array is passed as categories. RespVis only accepts string values as categories.
      // The title is used to correctly label e.g. category interactions in the filter tool.
      categories: {
        values: years,
        title: 'Years'
      },
      // This property can be set to a callback function, whose return value is
      // rendered as the content of the tooltip when hovering a bar.
      markerTooltipGenerator: ((e, d) => {
        return `Site: ${d.xValue}<br/>
                Total Remuneration: $${d3.format(',')(d.yValue)}<br/>
                Year: ${d.categoryFormatted ?? ''}<br/>`
      }),
      // This property configures at which layout widths the bar chart is flipped.
      flipped: {
        dependentOn: 'width',
        mapping: {0: true, 2: false}
      },
      // This property configures the maximum scale factors for zooming in and out.
      zoom: {
        in: 20,
        out: 1
      },
      // This property configures the content and position of the bar labels.
      // Each label is assigned to a bar.
      labels: {
        values: compensations.map(comp => d3.format('.2s')(comp)),
        offset: 6, positionStrategy: 'dynamic'
      }
    },
    // This property configures the chart breakpoints.
    breakpoints: {
      width: {
        values: [20, 45, 50],
        unit: 'rem'
      }
    },
    // This property configures the legend.
    legend: {
      title: 'Year'
    },
    // This property configures the x-axis.
    x: {
      title: 'Country',
      breakpoints: {
        width: axisBreakPointsWidth,
      },
    },
    // This property configures the y-axis.
    y: {
      title: 'Total Remuneration',
      subTitle: '[EU]',
      breakpoints: {
        width: axisBreakPointsWidth
      },
      // This property configures the orientation of the y-axis ticks, if the axis is flipped.
      // Ticks transition from narrow spaces (layout width 0, tick orientation = 90°)
      // to wide spaces (layout width 3, tick orientation = 0°)
      tickOrientationFlipped: {
        scope: 'self',
        dependentOn: 'width',
        breakpointValues: {0: 90, 2: 0}
      },
      // This property configures the tick formatting for different chart widths.
      configureAxis: {
        dependentOn: 'width',
        scope: 'chart',
        mapping: {0: (axis) => axis.tickFormat(d3.format('.2s')), 3: (axis) => axis.tickFormat()}
      },
    }
  }

  // First, the chart wrapper is selected. Then, a new empty div is appended.
  // This empty div will be the chart window once the render process is complete.
  const chartWindow = d3.select(selector).append('div')
  // A new chart instance is created. Then the chart is built by calling its buildChart() method.
  const renderer = new BarChart(chartWindow, barChartArgs)
  renderer.buildChart()
  // The chart contains legend items, which grow on hover due to CSS rules.
  // This growth makes it necessary to recompute the bounds of all chart elements.
  const itemHover = () => {
    layouterCompute(renderer.layouterS)
    renderer.render()
  }
  chartWindow.selectAll('.legend-item')
    .on('mouseenter', itemHover)
    .on('mouseleave', itemHover)
}
