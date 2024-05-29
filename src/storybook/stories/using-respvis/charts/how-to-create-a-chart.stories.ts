import {renderLineChart} from "storybook-util/render/render-line.chart";
import type {Meta, StoryObj} from "@storybook/html";
import {LineChartUserArgs} from "respvis-line";
import {
  singleLineChartDateValues,
  singleLineChartLabeled,
  singleLineChartLabelsAndTooltips,
  singleLineChartResponsiveAxisTicks,
  singleLineChartResponsiveTitle,
  singleLineChartValuesOnly
} from "storybook-util/arguments/single-line-chart-progression/values-only";
import {chartExampleMeta} from "storybook-util/render/meta/chart-example-meta";
import AddPaddingLeftCSS from '../../util/arguments/single-line-chart-progression/add-padding-left.css?raw'
import RemoveAxesCSS from '../../util/arguments/single-line-chart-progression/remove-axes.css?raw'
import TooltipsAndLabelsCSS from '../../util/arguments/single-line-chart-progression/tooltips-and-labels.css?raw'

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

export const Labeled: Story = {
  name: 'Labeled',
  args: singleLineChartLabeled,
}

export const WithDateValues = {
  name: 'With Date Values',
  args: singleLineChartDateValues,
  parameters: {
    sources: {
      css: { title: 'CSS Code', code: AddPaddingLeftCSS },
    }
  }
}

export const WithResponsiveTitle: Story = {
  name: 'With Responsive Title',
  args: singleLineChartResponsiveTitle,
  parameters: {
    sources: {
      css: { title: 'CSS Code', code: AddPaddingLeftCSS },
    }
  }
}

export const WithResponsiveAxisTicks: Story = {
  name: 'With Responsive Axis Ticks',
  args: singleLineChartResponsiveAxisTicks,
  parameters: {
    sources: {
      css: { title: 'CSS Code', code: AddPaddingLeftCSS },
    }
  }
}

export const TooltipsAndLabelsInsteadOfAxes: Story = {
  name: 'Tooltips and Labels instead of Axes',
  args: singleLineChartLabelsAndTooltips,
  parameters: {
    sources: {
      css: { title: 'CSS Code', code: [AddPaddingLeftCSS, RemoveAxesCSS, TooltipsAndLabelsCSS] },
    }
  }
}

export default meta
