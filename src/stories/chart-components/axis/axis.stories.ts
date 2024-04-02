import type {StoryObj} from '@storybook/html';
import {LineChart, LineChartUserArgs} from "../../../lib";
import {format, select} from "d3";
import {students, years} from "../../../examples/linecharts/linechart/data/students-tugraz";

const meta = {
  title: 'Chart-Components/Axis',
  tags: ['autodocs'],
  render: (args) => {
    const id = 'chart-window'
    const chartWindow = document.createElement('div')
    chartWindow.id = id
    document.addEventListener("DOMContentLoaded", renderComponent);
    function renderComponent() {
      const chartS = select(`#${id}`) as any
      const linchartArgs: LineChartUserArgs = {
        series: {
          x: { values: years },
          y: { values: students },
          markerTooltips: {
            tooltips: (_, {xValue, yValue}) =>
              `Year: ${xValue}<br/>Students: ${format('.2f')(yValue)}`,
          },
          flipped: {
            dependentOn: 'width',
            mapping: {0: true, 2: false}
          }
        },
        bounds: {
          width: {
            values: [20, 30, 50],
            unit: 'rem'
          }
        },
        title: {
          dependentOn: 'width',
          mapping: {0: 'Registered Students', 1 : 'Students at TU Graz', 3: 'Students Registered at TU Graz'}
        },
        subTitle: {
          dependentOn: 'width',
          mapping: {0: 'TU Graz', 1 : ''}
        },
        x: {
          title: 'Year',
          subTitle: '[2012 to 2021]',
          bounds: {
            width: {
              values: [10, 30, 50],
              unit: 'rem'
            }
          },
          configureAxis: (axis) => axis.tickFormat(format('.3d'))
        },
        y: {
          title: 'Students',
          subTitle: '[Winter Semester]',
          // configureAxis: {
          //   dependentOn: 'width',
          //   scope: 'chart',
          //   mapping: {0: (axis) => axis.tickFormat(formatWithDecimalZero(format('.2s'))),
          //     2: (axis) => axis.tickFormat(formatWithDecimalZero(format(',')))
          //   }
          // }
        },
        zoom: {
          in: 20,
          out: 1
        }
      }
      const linechart = new LineChart(chartS, linchartArgs)
      linechart.buildChart()
    }
    return chartWindow
  },
  argTypes: {
    backgroundColor: { control: 'color' },
    label: { control: 'text' },
    onClick: { action: 'onClick' },
    primary: { control: 'boolean' },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  // args: { onClick: fn() },
} // satisfies Meta<ButtonProps>;

export default meta;
type Story = StoryObj//<ButtonProps>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    primary: true,
    label: 'Button',
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
