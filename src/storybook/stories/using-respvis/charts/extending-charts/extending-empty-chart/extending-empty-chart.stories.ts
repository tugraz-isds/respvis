import type {Meta, StoryObj} from '@storybook/html';
import {rawCode} from "../../../../util/raw-code";
import {renderChart} from "../../../../util/chart-extensions/axis-chart/render-chart";
import {AxisChartAxisUserArgs, AxisChartUserArgs} from "storybook-util/chart-extensions/axis-chart/validate-axis-chart";
import {AustrianCitiesData} from "data"
import {BreakpointPropertyUserArgs} from "respvis-core";
import AxisFlippingCSS from "./axis-flipping.css?raw";
import {ComponentBreakpointsUserArgs} from "respvis-core/data/breakpoints/component-breakpoints/component-breakpoints";

const {cities, populations} = AustrianCitiesData.default

const meta = {
  title: 'Using RespVis/Charts/Extending Charts/Extending Empty Chart',
  parameters: {
    docs: {
      story: {
        inline: false,
        height: 500
      },
    },
    sources: {
      js: {title: 'JS Code', code: (args: object) => rawCode({args})},
    }
  },
  render: renderChart,
} satisfies Meta<AxisChartUserArgs>;

export default meta;
type Story = StoryObj<AxisChartUserArgs>

const breakpoints: ComponentBreakpointsUserArgs = {
  width: {
    values: [20, 40, 60],
    unit: "rem"
  },
  height: {
    values: [20, 40, 60],
    unit: "rem"
  }
}

const tickOrientationHorizontalCities: BreakpointPropertyUserArgs<number> = {
  dependentOn: 'width',
  breakpointValues: {0: 90, 2: 0}
}

const tickOrientationHorizontalPopulation: BreakpointPropertyUserArgs<number> = {
  dependentOn: 'width',
  breakpointValues: {0: -90, 2: -20}
}

const tickOrientationVertical: BreakpointPropertyUserArgs<number> = {
  dependentOn: 'height',
  breakpointValues: {0: 0, 2: 30}
}

const bottomToRightAxis: AxisChartAxisUserArgs = {
  vals: {values: cities}, title: 'Cities', standardOrientation: "horizontal", verticalLayout: 'right',
  tickOrientation: tickOrientationHorizontalCities,
  tickOrientationFlipped: tickOrientationVertical,
}

const leftToTopAxis: AxisChartAxisUserArgs = {
  vals: {values: populations}, title: 'Population', standardOrientation: "vertical", horizontalLayout: 'top',
  tickOrientation: tickOrientationVertical,
  tickOrientationFlipped: tickOrientationHorizontalPopulation
}

const topToLeftAxis: AxisChartAxisUserArgs = {
  vals: {values: cities}, title: 'Cities', standardOrientation: "horizontal", horizontalLayout: 'top',
  tickOrientation: {
    dependentOn: 'width',
    breakpointValues: {0: -90, 2: 0}
  }
}

const rightToBottomAxis: AxisChartAxisUserArgs = {
  vals: {values: populations}, title: 'Population', standardOrientation: "vertical", verticalLayout: 'right',
  tickOrientation: tickOrientationVertical
}

export const Primary: Story = {
  args: {
    title: 'Axis Chart',
    breakpoints: breakpoints,
    axes: [
      bottomToRightAxis,
      leftToTopAxis,
      topToLeftAxis,
      rightToBottomAxis
    ]
  },
};

export const Flipping: Story = {
  args: {
    title: 'Axis Chart',
    breakpoints: breakpoints,
    axes: [
      bottomToRightAxis,
      leftToTopAxis,
    ],
    flipped: {
      dependentOn: "width",
      mapping: {0: true, 1: true, 2: false}
    }
  },
  parameters: {
    sources: {
      css: { title: 'CSS Code', code: AxisFlippingCSS },
    }
  }
}
