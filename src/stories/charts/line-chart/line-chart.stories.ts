import type {Meta, StoryObj} from '@storybook/html';
import {formatWithDecimalZero, LineChart, LineChartUserArgs} from "../../../lib";
import {format, select, Selection} from "d3";
import {students, years} from "../../../examples/linecharts/linechart/data/students-tugraz";
import './line-chart-story.css'
import {renderChartWindow} from "../../util/render-chart-window";

const meta = {
  title: 'Charts/Line-Chart',
  tags: ['autodocs'],
  parameters: {
    docs: {
      story: {
        inline: false,
        height: 400
      },
    },
  },
  render: (args) => {
    args.series.markerTooltips = {
      tooltips: (_, {xValue, yValue}) =>
        `Year: ${xValue}<br/>Students: ${format('.2f')(yValue)}`
    }
    args.y.configureAxis = {
      dependentOn: 'width',
        scope: 'chart',
        mapping: {0: (axis) => axis.tickFormat(formatWithDecimalZero(format('.2s'))),
        2: (axis) => axis.tickFormat(formatWithDecimalZero(format(',')))
      }
    }
    args.x.configureAxis = (axis) => axis.tickFormat(format('.3d'))

    const {chartWindow, id} = renderChartWindow()
    document.addEventListener("DOMContentLoaded", () => {
      const chartS = select(`#${id}`) as Selection<any, any>
      const linechart = new LineChart(chartS, args)
      linechart.buildChart()
    })
    return chartWindow
  },
} satisfies Meta<LineChartUserArgs>;

export default meta;
type Story = StoryObj<LineChartUserArgs>;

export const BasicLineChart: Story = {
  args: {
    series: {
      x: { values: years },
      y: { values: students },
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
      }
    },
    y: {
      title: 'Students',
      subTitle: '[Winter Semester]',
    },
    zoom: {
      in: 20,
      out: 1
    }
  },
}
