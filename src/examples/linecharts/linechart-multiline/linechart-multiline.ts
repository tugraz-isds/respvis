import {LineChart, LineChartUserArgs, select, selectAll, timeFormat, timeYear} from './libs/respvis/respvis.js';
import {mapPowerConsumptionData} from './data/electric-power-consumption.js'

/**
 * Render Function of a Multi-Series Line Chart
 * @param selector The selector for querying the wrapper of the Multi-Series Line Chart
 */
export const renderMultiLineChart = (selector: string) => {
  const {yUSA, yEurope, yAsia, yearsJSDateFormat} = mapPowerConsumptionData()

  // using LineChartUserArgs provides type support
  const data: LineChartUserArgs = {
    breakpoints: {
      width: {
        values: [25, 30, 50],
        unit: 'rem'
      }
    },

    series: {
      x: {                           // array of Date objects for x values
        values: [...yearsJSDateFormat, ...yearsJSDateFormat, ...yearsJSDateFormat]
      },
      y: {                           // array of numbers for y values
        values: [...yUSA, ...yEurope, ...yAsia]
      },
      categories: {
        title: 'Continents',         // used to label the category
        values: [                    // array of strings for categories
          ...yUSA.map(() => 'USA'),
          ...yEurope.map(() => 'Europe'),
          ...yAsia.map(() => 'Asia')
        ],
      },

      // callback function returning tooltip when data points hovered
      markerTooltipGenerator: (_, point) =>
        `Year: ${(point.xValue as Date).getFullYear()}
        <br/>Pow. Consumption: ${point.yValue}kWh`,

      // maximum scale factors for zooming in and out
      zoom: {
        in: 20,
        out: 1
      }
    },

    title: {
      dependentOn: 'width',
      mapping: {0: 'Power (kWh)', 1: 'Power Consumption (kWh)', 3: 'Electric Power Consumption (kWh per Capita)'}
    },

    x: {
      title: 'Year',
      subTitle: '[2012 to 2021]',

      breakpoints: {
        width: {
          values: [10, 30, 50],
          unit: 'rem'
        }
      },

      // orientation of x-axis tick labels
      // rotation is interpolated between 0° (wide) and 90° (narrow)
      tickOrientation: {
        dependentOn: 'width',
        scope: 'self',
        breakpointValues: {0: 90, 2: 0},
      },

      // tick formatting for temporal axis
      configureAxis: (axis) => {
        axis.ticks(timeYear.every(2))
        axis.tickFormat(timeFormat('%Y'))
      },
      gridLineFactor: 1              // vertical grid line for each x-axis tick
    },

    y: {
      title: 'Consumption',
      breakpoints: {
        width: {
          values: [10, 30, 50],
          unit: 'rem'
        }
      },

      // orientation of y-axis tick labels, if y-axis is flipped
      // rotation is interpolated between 0° (wide) and 90° (narrow)
      tickOrientationFlipped: {
        dependentOn: 'width',
        scope: 'self',
        breakpointValues: {0: 90, 2: 0},
      },
      gridLineFactor: 2              // horizontal grid line for each 2nd y-axis tick
    },

    // assign classnames to currently inspected data points (inspection tool)
    tooltip: {
      onInspectMove: (info) => {
        const pointS = selectAll('.point.element')
        const nearestPointS = pointS.filter((d) => d.xValue === info.horizontalNearestRealValue)
        nearestPointS.classed('inspect-nearest', true)
        const otherPointS = pointS.filter((d) => d.xValue !== info.horizontalNearestRealValue)
        otherPointS.classed('inspect-nearest', false)
      }
    }
  }

  // append empty div for chart window and create new chart instance
  const chartWindow = select(selector).append('div')
  const renderer = new LineChart(chartWindow, data)
  renderer.buildChart()
}
