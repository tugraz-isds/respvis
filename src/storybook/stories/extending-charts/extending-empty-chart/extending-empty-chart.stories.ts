import type {Meta, StoryObj} from '@storybook/html';
import {rawCode} from "../../util/raw-code";
import {renderChart} from "../../util/chart-extensions/axis-chart/render-chart";
import {AxisChartUserArgs} from "../../util/chart-extensions/axis-chart/axis-chart-validation";
import {AustrianCitiesData} from "../../util/data"

const {cities, populations} = AustrianCitiesData.default

const meta = {
  title: 'Extending Charts/Extending Empty Chart',
  parameters: {
    docs: {
      story: {
        inline: false,
        height: 500
      },
    },
    sources: {
      js: { title: 'JS Code', code: (args: object) => rawCode({args}) },
    }
  },
  render: renderChart,
} satisfies Meta<AxisChartUserArgs>;

export default meta;
type Story = StoryObj<AxisChartUserArgs>

export const Primary: Story = {
  args: {
    title: 'Axis Chart',
    breakPoints: {
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
