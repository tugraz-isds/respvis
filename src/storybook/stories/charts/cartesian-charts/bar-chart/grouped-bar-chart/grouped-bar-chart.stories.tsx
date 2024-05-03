import type {Meta, StoryObj} from '@storybook/html';
import {BarChartUserArgs} from "../../../../../../lib";
import GroupedBarChartCSS from './grouped-bar-chart.css?inline'
import {rawCode} from "../../../../util/raw-code";
import {CompensationEmployeeData} from '../../../../data'
import {renderBarChart} from "../render-bar.chart";
import {format} from "d3";

const {compensations, sites, years} = CompensationEmployeeData

const meta = {
  title: 'Charts/Cartesian Charts/Bar Charts/Grouped Bar Chart',
  parameters: {
    docs: {
      story: {
        inline: false,
        height: 500
      },
    },
    sources: {
      js: { title: 'JS Code', code: (args: object) => rawCode({args}) }
    }
  },
  render: renderBarChart
} satisfies Meta<BarChartUserArgs>;

type Story = StoryObj<BarChartUserArgs>;

const tickOrientationHorizontal = {
  scope: 'self',
  dependentOn: 'width',
  mapping: {0: 90, 3: 0} //{0: 90, 1: -180, 3: 179} // demonstration purposes
} as const
const axisBreakPointsWidth = {
  values: [10, 30, 50],
  unit: 'rem'
} as const
const axisBreakPointsHeight = {
  values: [10, 20, 30],
  unit: 'rem'
} as const

export const Primary: Story = {
  name: 'Fully Responsive',
  args: {
    series: {
      type: 'grouped',
      x: { values: sites },
      y: { values: compensations },
      categories: {
        values: years,
        title: 'Years'
      },
      markerTooltips: {
        tooltips: ((e, d) => {
          return `Site: ${d.xValue}<br/>
                Total Remuneration: $${format(',')(d.yValue)}<br/>
                Year: ${d.tooltipLabel}<br/>`
        })
      },
      flipped: {
        dependentOn: 'width',
        mapping: {0: true, 2: false}
      },
      zoom: {
        in: 20,
        out: 1
      },
      labels: {
        values: compensations.map(comp => format('.2s')(comp)),
        offset: 6, position: 'dynamic'
      }
    },
    breakPoints: {
      width: {
        values: [20, 30, 50],
        unit: 'rem'
      }
    },
    legend: {
      title: 'Year'
    },
    // title: {
    //   dependentOn: 'width',
    //   mapping: {0: 'Population of Austria', 2: 'Population of Austrian Cities'},
    // },
    x: {
      title: 'Country',
      breakPoints: {
        width: axisBreakPointsWidth,
        height: axisBreakPointsHeight
      },
      gridLineFactor: 1
      // tickOrientation: tickOrientationHorizontal,
      // tickOrientationFlipped: tickOrientationVertical
    },
    y: {
      title: 'Total Remuneration',
      subTitle: '[EU]',
      breakPoints: {
        height: axisBreakPointsHeight,
        width: axisBreakPointsWidth
      },
      gridLineFactor: 1,
      // tickOrientation: tickOrientationVertical,
      tickOrientationFlipped: tickOrientationHorizontal,
      configureAxis: {
        dependentOn: 'width',
        scope: 'chart',
        mapping: {0: (axis) => axis.tickFormat(format('.2s')), 3: (axis) => axis.tickFormat()}
      },
    }
  },
  parameters: {
    sources: {
      css: { title: 'CSS Code', code: GroupedBarChartCSS },
    }
  }
}

export default meta;
