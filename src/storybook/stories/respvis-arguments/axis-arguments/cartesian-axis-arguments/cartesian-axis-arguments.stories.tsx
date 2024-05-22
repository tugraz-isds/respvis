import type {Meta, StoryObj} from '@storybook/html';
import {LineChartUserArgs} from "respvis-line";
import {rawCode} from "../../../util/raw-code";
import {renderLineChart} from "../../../util/render/render-line.chart";
import FullyResponsiveCSS from '../../example-multi-line/example-multi-line.css?inline'
import {y} from "../../example-multi-line/arguments/y-cartesian-axis-arg";
import {RotatingTicksArgumentsWithFlipCorrect} from "../base-axis-arguments/base-axis-arguments.stories";
import {x} from "../../example-multi-line/arguments/x-cartesian-axis-arg";

const meta = {
  title: 'RespVis Arguments/Axis Arguments/Cartesian Axis Arguments',
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

export const CartesianAxisArgs: Story = {
  name: 'Cartesian Axis Args',
  args: {...RotatingTicksArgumentsWithFlipCorrect.args,
    series: {...RotatingTicksArgumentsWithFlipCorrect.args!.series!,
    },
    x,
    y
  }
}

export default meta;
