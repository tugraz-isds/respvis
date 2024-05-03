import type {Meta, StoryObj} from '@storybook/html';
import {LineChartUserArgs} from "../../../../../lib";
import {rawCode} from "../../../util/raw-code";
import {PowerConsumptionData} from '../../../data'
import {renderLineChart} from "../../cartesian-charts/line-chart/render-line.chart";
import FullyResponsiveCSS from '../example-multi-line/example-multi-line.css?inline'
import {breakPoints} from "../example-multi-line/arguments/breakPoints-argument";
import {title} from "../example-multi-line/arguments/title-argument";
import {subTitle} from "../example-multi-line/arguments/subTitle-argument";
import {x as xBase} from "../example-multi-line/arguments/x-axis-base-arg";
import {x} from "../example-multi-line/arguments/x-ticks-rotating-arg";
import {y} from "../example-multi-line/arguments/y-ticks-rotating-flipped-arg";

const {yUSA, yEurope, yAsia, yearsJSDateFormat} = PowerConsumptionData.mapPowerConsumptionData()
const categories = [
  ...yUSA.map(() => 'USA'),
  ...yEurope.map(() => 'Europe'),
  ...yAsia.map(() => 'Asia')]

const meta = {
  title: 'Charts/RespVis Arguments/Axis Arguments',
  parameters: {
    docs: {
      story: {
        inline: false,
        height: 500
      },
    },
    sources: {
      js: { title: 'JS Code', code: (args: object) => rawCode({args}) },
      css: { title: 'CSS Code',  code: FullyResponsiveCSS }
    }
  },
  render: renderLineChart
} satisfies Meta<LineChartUserArgs>;

type Story = StoryObj<LineChartUserArgs>;

export const AxisConfigArguments: Story = {
  name: 'Configuring Axis Arguments',
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
    x : xBase,
    y: { title: 'Consumption' }
  }
}

export const RotatingTicksArguments: Story = {
  name: 'Rotating Ticks Arguments',
  args: { ...AxisConfigArguments.args,
    x, y: { title: 'Consumption' }
  }
}

export const RotatingTicksArgumentsWithFlipIncorrect: Story = {
  name: 'Rotating Ticks Arguments With Flip Incorrect',
  args: {...RotatingTicksArguments.args,
    series: {...RotatingTicksArguments.args!.series!,
      flipped: {
        dependentOn: 'width',
        mapping: {0: true, 2: false}
      }
    }
  }
}

export const RotatingTicksArgumentsWithFlipCorrect: Story = {
  name: 'Rotating Ticks Arguments With Flip Correct',
  args: {...RotatingTicksArguments.args,
    series: {...RotatingTicksArguments.args!.series!,
      flipped: {
        dependentOn: 'width',
        mapping: {0: true, 2: false}
      }
    },
    y
  }
}

export default meta;
