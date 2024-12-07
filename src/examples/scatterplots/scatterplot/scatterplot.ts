import {formatWithDecimalZero, Point, ScatterPlot, ScatterPlotUserArgs} from './libs/respvis/respvis.js';
import * as d3 from './libs/d3-7.6.0/d3.js'
import {getTopMakesData} from "./data/sold-cars-germany.js";

/**
 * Render Function of a Scatter Plot
 * @param selector The selector for querying the wrapper of the Scatter Plot
 */
export function createScatterplot(selector: string) {
  const {mileages, horsePower, prices, makes} = getTopMakesData(5)

  // using ScatterPlotUserArgs provides type support
  const data: ScatterPlotUserArgs = {
    breakpoints: {
      width: {
        values: [40, 60, 90],        // chart breakpoints
        unit: 'rem'
      }
    },

    title: {
      dependentOn: 'width',
      mapping: {0: 'Car Characteristics',
        2: 'Car Characteristics from AutoScout24 in Germany'}
    },

    series: {
      x: {
        values: horsePower,          // array of numbers for x values
      },
      y: {
        values: prices,              // array of numbers for y values
      },
      categories: {
        title: 'Makes',             // used to label the category
        values: makes               // array of strings for categories
      },

      radii: {
        values: mileages,           // array of numbers for radii
        axis: {                     // radii axis in legend
          title: 'Mileage',
          horizontalLayout: 'bottom',
          configureAxis: (axis => {
            axis.ticks(2)
            axis.tickFormat(d3.format('.2s'))
          })
        },

        extrema: {                  // radii sizes are interpolated
          dependentOn: 'width',
          breakpointValues: {
            0: {minimum: 3, maximum: 12},
            1: {minimum: 5, maximum: 15},
            2: {minimum: 7, maximum: 20},
          },
        },
      },

      // callback function returning tooltip when point hovered
      markerTooltipGenerator: ((e, d: Point) => {
        return `Car Price: ${d.yValue}€<br/>
                Horse Power: ${d.xValue}PS<br/>
                Make: ${d.categoryFormatted ?? ''}<br/>
                Mileage: ${d.radiusValue}km<br/>`
      }),

      // maximum scale factors for zooming in and out
      zoom: {
        in: 20,
        out: 1
      },
    },

    x: {
      title: {
        dependentOn: 'width',
        scope: 'self',
        mapping: {0: 'HP in [PS]', 1: 'Horse P. [PS]', 2: 'Horse Power in [PS]'}
      },

      breakpoints: {
        width: {
          values: [10, 30, 50],
          unit: 'rem'
        }
      },

      // tick formatting for different axis widths
      // number of ticks is reduced via D3 ticks function
      configureAxis: {
        dependentOn: 'width',
        scope: 'self',
        mapping: {
          0: (axis) => {
            axis.tickFormat(d3.format('.3d'))
            axis.ticks(7)
          },
          2: (axis) => {
            axis.tickFormat(d3.format('.3d'))
          }
        }
      }
    },

    y: {
      title: 'Car Price [EU]',

      // tick formatting for different chart widths
      configureAxis: {
        dependentOn: 'width',
        scope: 'chart',
        mapping: {
          0: (axis) => axis.tickFormat(formatWithDecimalZero(d3.format('.2s'))),
          2: (axis) => axis.tickFormat(formatWithDecimalZero(d3.format(',')))
        }
      }
    },

    legend: {
      title: {
        dependentOn: 'width',
        scope: 'chart',
        mapping: {0: '', 1: 'Makes'}
      },
    }
  }

  // append empty div for chart window and create new chart instance
  const chartWindow = d3.select(selector).append('div')
  const renderer = new ScatterPlot(chartWindow, data)
  renderer.buildChart()
}
