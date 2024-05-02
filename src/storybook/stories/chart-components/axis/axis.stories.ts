import type {Meta, StoryObj} from '@storybook/html';
import {rawCode} from "../../util/raw-code";
import {renderChart} from "./render-chart";
import AxisChartCSS from './axis-chart.css?inline'
import {AxisChartUserArgs} from "../example-extensions/axis-chart/axis-chart-validation";
import {AustrianCitiesData} from "../../data"

const {cities, populations} = AustrianCitiesData.default

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
} satisfies Meta<AxisChartUserArgs>;

export default meta;
type Story = StoryObj<AxisChartUserArgs>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    title: 'Axis Chart',
    bounds: {
      width: {
        values: [20, 40, 60],
        unit: "rem"
      },
      height: {
        values: [20, 40, 60],
        unit: "rem"
      }
    },
    axes: [
      {
        vals: { values: cities}, title: 'Cities', standardOrientation: "horizontal",
        tickOrientation: {
          dependentOn: 'width',
          mapping: {0: 90, 2: 0}
        }
      },
      { vals: { values: populations}, title: 'Population', standardOrientation: "vertical",
        tickOrientation: {
          dependentOn: 'height',
          mapping: {0: 45, 2: 0}
        }
      },
      {
        vals: {values: cities}, title: 'Cities', standardOrientation: "horizontal", horizontalLayout: 'top',
        tickOrientation: {
          dependentOn: 'width',
          mapping: {0: -90, 2: 0}
        }
      },
      {
        vals: { values: populations}, title: 'Population', standardOrientation: "vertical", verticalLayout: 'right',
        tickOrientation: {
          dependentOn: 'height',
          mapping: {0: -45, 2: 0}
        }
      },
    ]
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
