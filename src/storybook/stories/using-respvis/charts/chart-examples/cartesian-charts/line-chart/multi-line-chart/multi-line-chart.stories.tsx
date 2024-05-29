import type {Meta, StoryObj} from '@storybook/html';
import {LineChartUserArgs} from "respvis-line";
import {timeFormat} from "d3";
import {rawCode} from "../../../../../../util/raw-code";
import {PowerConsumptionData} from 'data'
import {renderLineChart} from "../../../../../../util/render/render-line.chart";
import FullyResponsiveCSS from './multi-line-chart.css?inline'

const {yUSA, yEurope, yAsia, yearsJSDateFormat} = PowerConsumptionData.mapPowerConsumptionData()
const categories = [
  ...yUSA.map(() => 'USA'),
  ...yEurope.map(() => 'Europe'),
  ...yAsia.map(() => 'Asia')]

const meta = {
  title: 'Using RespVis/Charts/Chart Examples/Cartesian Charts/Line Charts/Multi Line Chart',
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
  render: renderLineChart
} satisfies Meta<LineChartUserArgs>;

type Story = StoryObj<LineChartUserArgs>;

export const FullyResponsive: Story = {
  name: 'Fully Responsive',
  args: {
    series: {
      x: {values: [...yearsJSDateFormat, ...yearsJSDateFormat, ...yearsJSDateFormat]},
      y: {values: [...yUSA, ...yEurope, ...yAsia]},
      categories: {
        values: categories,
        title: 'Continents'
      },
      markerTooltips: {
        tooltips: (_, point) => {
          return `Year: ${point.xValue}<br/>Pow. Consumption: ${point.yValue}kWh`
        }
      },
      flipped: {
        dependentOn: 'width',
        mapping: {0: true, 2: false}
      },
      zoom: {
        in: 20,
        out: 1
      }
    },
    breakPoints: {
      width: {
        values: [25, 30, 50],
        unit: 'rem'
      }
    },
    title: {
      dependentOn: 'width',
      mapping: {0: 'Power (kWh)', 1: 'Power Consumption (kWh)', 3: 'Electric Power Consumption (kWh per Capita)'}
    },
    subTitle: {
      dependentOn: 'width',
      mapping: {0: 'TU Graz', 1: ''}
    },
    x: {
      title: 'Year',
      subTitle: '[2012 to 2021]',
      tickOrientation: {
        dependentOn: 'width',
        scope: 'self',
        mapping: {0: 90, 3: 0},
      },
      breakPoints: {
        width: {
          values: [10, 30, 50],
          unit: 'rem'
        }
      },
      // configureAxis: (axis) => axis.tickFormat((v) => v),
      configureAxis: (axis) => axis.tickFormat(timeFormat('%Y'))
    },
    y: {
      title: 'Consumption',
      breakPoints: {
        width: {
          values: [10, 30, 50],
          unit: 'rem'
        }
      },
      tickOrientationFlipped: {
        dependentOn: 'width',
        scope: 'self',
        mapping: {0: 90, 3: 0},
      },
    }
  },
  parameters: {
    sources: {
      css: { title: 'CSS Code',  code: FullyResponsiveCSS }
    }
  }
}

export default meta;
