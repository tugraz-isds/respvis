import {renderLineChart} from "storybook-util/render/render-line.chart";
import type {Meta, StoryObj} from "@storybook/html";
import {LineChartUserArgs} from "respvis-line";
import {singleLineChartValuesOnly} from "storybook-util/arguments/single-line-chart/values-only";
import {chartExampleMeta} from "storybook-util/render/meta/chart-example-meta";

const meta = {
  ...chartExampleMeta,
  title: 'Using RespVis/Charts/How to create a Chart',
  render: renderLineChart
} satisfies Meta<LineChartUserArgs>;

type Story = StoryObj<LineChartUserArgs>;

export const Basic: Story = {
  name: 'Basic',
  args: singleLineChartValuesOnly,
}

export default meta
