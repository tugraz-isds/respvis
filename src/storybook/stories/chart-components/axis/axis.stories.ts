import type {Meta, StoryObj} from '@storybook/html';
import {ChartUserArgs} from "../../../../lib";
import {rawCode} from "../../util/raw-code";
import {renderChart} from "./render-chart";
import AxisChartCSS from './axis-chart.css?inline'

const meta = {
  title: 'Chart-Components/Axis',
  parameters: {
    docs: {
      story: {
        inline: false,
        height: 500
      },
    },
    sources: {
      js: { title: 'JS Code', code: (args: object) => rawCode({args}) },
      css: {title: 'CSS Code', code: AxisChartCSS }
    }
  },
  render: renderChart,
} satisfies Meta<ChartUserArgs>;

export default meta;
type Story = StoryObj<ChartUserArgs>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    title: 'Axis Chart'
  },
};
//
// export const Secondary: Story = {
//   args: {
//     label: 'Button',
//   },
// };
//
// export const Large: Story = {
//   args: {
//     size: 'large',
//     label: 'Button',
//   },
// };
//
// export const Small: Story = {
//   args: {
//     size: 'small',
//     label: 'Button',
//   },
// };
