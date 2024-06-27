import type {Meta, StoryObj} from '@storybook/html';
import {Point, ScatterPlotUserArgs} from "respvis-point";
import {formatWithDecimalZero} from "respvis-core";
import standardBarChartCSS from './scatterplot.css?inline'
import {rawCode} from "../../../../../util/raw-code";
import {SoldCarsGermanyData} from 'data'
import {format, scaleLinear} from "d3";
import {renderScatterplot} from "../../../../../util/render/render-scatterplot";

const {carData, getTopMakesData} = SoldCarsGermanyData
const {mileages, horsePower, prices, makes} = getTopMakesData(5)
const allHorsePower = carData.map(entry => entry.hp)
const allPrices = carData.map(entry => entry.price)
const allMileages = carData.map(entry => entry.mileage)

const meta = {
  title: 'Using RespVis/Charts/Chart Examples/Cartesian Charts/Scatterplot',
  parameters: {
    docs: {
      story: {
        inline: false,
        height: 500
      },
    },
    sources: {
      js: { title: 'JS Code', code: (args: object) => rawCode({args}) }
    }
  },
  render: renderScatterplot
} satisfies Meta<ScatterPlotUserArgs>;

type Story = StoryObj<ScatterPlotUserArgs>;

const baseScaleX = scaleLinear()
  .domain([0, Math.max(...allHorsePower)])
  .nice()
const baseScaleY = scaleLinear()
  .domain([0, Math.max(...allPrices)])
  .nice()
const radiusScale = scaleLinear()
  .domain([0, Math.max(...allMileages)])
  .range([5, 20])

export const Primary: Story = {
  name: 'Fully Responsive',
  args: {
    series: {
      x: {
        values: horsePower,
        // values: horsePowerWithExtrema,
        scale: baseScaleX
      },
      y: {
        values: prices,
        // values: pricesWithExtrema,
        scale: baseScaleY
      },
      categories: {
        values: makes,
        title: 'Makes'
      },
      radii: {
        values: mileages,
        axis: {
          title: 'Mileage',
          horizontalLayout: 'bottom',
          configureAxis: (axis => {
            axis.ticks(2)
            axis.tickFormat(format('.2s'))
          })
        },
        extrema: {
          dependentOn: 'width',
          breakpointValues: {
            0: {minimum: 3, maximum: 12},
            1: {minimum: 5, maximum: 15},
            3: {minimum: 7, maximum: 30},
          },
        },
      },
      markerTooltipGenerator: ((e, d: Point) => {
        return `Car Price: ${d.yValue}€<br/>
                Horse Power: ${d.xValue}PS<br/>
                Make: ${d.category}<br/>
                Mileage: ${d.radiusValue}km<br/>`
      }),
      zoom: {
        in: 20,
        out: 1
      },
      // labels: makes
    },
    breakpoints: {
      width: {
        values: [40, 60],
        unit: 'rem'
      }
    },
    title: {
      dependentOn: 'width',
      mapping: {0 : 'Car Characteristics', 2: 'Car Characteristics from AutoScout24 in Germany'}
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
      configureAxis: (axis) => axis.tickFormat(format('.3d')),
      gridLineFactor: 1
    },
    y: {
      title: 'Car Price [EU]',
      configureAxis: {
        dependentOn: 'width',
        scope: 'chart',
        mapping: {0: (axis) => axis.tickFormat(formatWithDecimalZero(format('.2s'))),
          2: (axis) => axis.tickFormat(formatWithDecimalZero(format(',')))
        }
      },
      gridLineFactor: 1
    },
    legend: {
      title: {
        dependentOn: 'width',
        scope: 'chart',
        mapping: {0: '', 1: 'Makes'}
      },
    }
  },
  parameters: {
    sources: {
      css: { title: 'CSS Code', code: standardBarChartCSS },
    }
  }
}

export default meta;
