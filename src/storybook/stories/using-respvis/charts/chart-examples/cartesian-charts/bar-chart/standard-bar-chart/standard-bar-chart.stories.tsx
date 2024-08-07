import type {Meta, StoryObj} from '@storybook/html';
import {BarChartUserArgs} from "respvis-bar";
import standardBarChartCSS from './standard-bar-chart.css?inline'
import {rawCode} from "../../../../../../util/raw-code";
import {AustrianCitiesData} from 'data'
import {renderBarChart} from "../../../../../../util/render/render-bar.chart";
import {format} from "d3";

const {cities, populations} = AustrianCitiesData.default

const meta = {
  title: 'Using RespVis/Charts/Chart Examples/Cartesian Charts/Bar Charts/Standard Bar Chart',
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
  breakpointValues: {0: 90, 2: 0} //{0: 90, 1: -180, 3: 179} // demonstration purposes
} as const
const tickOrientationVertical = {
  scope: 'self',
  dependentOn: 'height',
  breakpointValues: {0: 0, 2: 90} //{0: -180, 1: -180, 3: 179} // demonstration purposes
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
      x: { values: cities },
      y: { values: populations },
      markerTooltipGenerator: (i, d) => `City: ${d.xValue}<br/>Population: ${d.yValue}`,
      flipped: {
        dependentOn: 'width',
        mapping: {0: true, 2: false}
      },
      zoom: {
        in: 20,
        out: 1
      },
      labels: { values: populations, offset: 6}
    },
    breakpoints: {
      width: {
        values: [20, 30, 50],
        unit: 'rem'
      }
    },
    title: {
      dependentOn: 'width',
      mapping: {0: 'Population of Austria', 2: 'Population of Austrian Cities'},
    },
    x: {
      title: 'Cities',
      breakpoints: {
        width: axisBreakPointsWidth,
        height: axisBreakPointsHeight
      },
      tickOrientation: tickOrientationHorizontal,
      tickOrientationFlipped: tickOrientationVertical,
      gridLineFactor: 1
    },
    y: {
      title: 'Population',
      breakpoints: {
        height: axisBreakPointsHeight,
        width: axisBreakPointsWidth
      },
      tickOrientation: tickOrientationVertical,
      tickOrientationFlipped: tickOrientationHorizontal,
      configureAxis: (axis) => axis.tickFormat(format('.2s')),
      gridLineFactor: 1
    },
    // zoom: { //TODO: make bar chart work with zooming!
    //   in: 20,
    //   out: 1
    // }
    // legend: {
    //   title: {
    //     dependentOn: 'width',
    //     scope: 'chart',
    //     mapping: {0: '', 3: 'Legend'}
    //   }
    // }
  },
  parameters: {
    sources: {
      css: { title: 'CSS Code', code: standardBarChartCSS },
    }
  }
}

export default meta;
