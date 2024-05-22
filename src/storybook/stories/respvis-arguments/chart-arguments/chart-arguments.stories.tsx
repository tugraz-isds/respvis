import type {Meta, StoryObj} from '@storybook/html';
import {LineChartUserArgs} from "respvis-line";
import {timeFormat} from "d3";
import {rawCode} from "../../util/raw-code";
import {PowerConsumptionData} from '../../util/data'
import {renderLineChart} from "../../util/render/render-line.chart";
import FullyResponsiveCSS from '../example-multi-line/example-multi-line.css?inline'
import {breakPoints} from "../example-multi-line/arguments/breakPoints-argument";
import {title} from "../example-multi-line/arguments/title-argument";
import {subTitle} from "../example-multi-line/arguments/subTitle-argument";

const {yUSA, yEurope, yAsia, yearsJSDateFormat} = PowerConsumptionData.mapPowerConsumptionData()
const categories = [
  ...yUSA.map(() => 'USA'),
  ...yEurope.map(() => 'Europe'),
  ...yAsia.map(() => 'Asia')]

const meta = {
  title: 'RespVis Arguments/Chart Arguments',
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

export const ChartArgs: Story = {
  name: 'Chart Arguments',
  args: {
    series: {
      x: {values: [...yearsJSDateFormat, ...yearsJSDateFormat, ...yearsJSDateFormat]},
      y: {values: [...yUSA, ...yEurope, ...yAsia]},
      categories: {
        values: categories,
        title: 'Continents'
      }
    },
    breakPoints,
    title,
    subTitle,
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
      configureAxis: (axis) => axis.tickFormat(timeFormat('%Y'))
    },
    y: {
      title: 'Consumption',
      breakPoints: {
        width: {
          values: [10, 30, 50],
          unit: 'rem'
        }
      }
    }
  },
  parameters: {
    sources: {
      css: { title: 'CSS Code',  code: FullyResponsiveCSS }
    }
  }
}

export default meta;
