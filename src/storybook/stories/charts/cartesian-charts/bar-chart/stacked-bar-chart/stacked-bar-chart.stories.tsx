import type {Meta, StoryObj} from '@storybook/html';
import {BarChartUserArgs} from "../../../../../../lib";
import StackedBarChartCSS from './stacked-bar-chart.css?inline'
import {rawCode} from "../../../../util/raw-code";
import {DesktopPhoneTabletData} from '../../../../data'
import {renderBarChart} from "../render-bar.chart";
import {format, scaleLinear} from "d3";

const {
  desktop,
  desktopCategory,
  phone,
  phoneCategory,
  tablet,
  tabletCategory,
  years
} = DesktopPhoneTabletData

const meta = {
  title: 'Charts/Cartesian Charts/Bar Charts/Stacked Bar Chart',
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
const tickOrientationVertical = {
  scope: 'self',
  dependentOn: 'height',
  mapping: {0: 0, 3: 90} //{0: -180, 1: -180, 3: 179} // demonstration purposes
} as const
const axisBoundsWidth = {
  values: [10, 30, 50],
  unit: 'rem'
} as const
const axisBoundsHeight = {
  values: [10, 20, 30],
  unit: 'rem'
} as const

const yearsWhole = [...years, ...years, ...years]
const sharesWhole = [...desktop, ...phone, ...tablet]
const platformsWhole = [...desktopCategory, ...phoneCategory, ...tabletCategory]

export const Primary: Story = {
  name: 'Fully Responsive',
  args: {
    series: {
      type: 'stacked',
      aggregationScale: scaleLinear().domain([0, 100]).nice(),
      x: { values: yearsWhole },
      y: { values: sharesWhole },
      categories: {
        values: platformsWhole,
        title: 'Device Types'
      },
      markerTooltips: {
        tooltips: ((e, d) => {
          return `Device Type: ${d.tooltipLabel}<br/>
                Market Share: ${format(',')(d.yValue)}%<br/>
                Year: ${d.xValue}<br/>`
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
        values: sharesWhole.map(share => share.toString()), position: 'center',
        format: (bar, label) => {
          const labelFormatted = format('.2s')(parseFloat(label))
          return ((bar.width <= 20 && labelFormatted.length > 2)
            || bar.height <= 15) ? '' : labelFormatted
        }
      }
    },
    bounds: {
      width: {
        values: [20, 30, 50],
        unit: 'rem'
      }
    },
    legend: {
      title: 'Device Types'
    },
    x: {
      title: 'Year',
      bounds: {
        width: axisBoundsWidth,
        height: axisBoundsHeight
      },
      // tickOrientation: tickOrientationHorizontal,
      // tickOrientationFlipped: tickOrientationVertical
    },
    y: {
      title: 'Market Share',
      configureAxis: (a) => a.tickFormat((v) => `${v}%`),
      bounds: {
        height: axisBoundsHeight,
        width: axisBoundsWidth
      },
      // tickOrientation: tickOrientationVertical,
      tickOrientationFlipped: tickOrientationHorizontal,
      // configureAxis: (axis) => axis.tickFormat(d3.format('.2s')),
    },
    title: {
      dependentOn: 'width',
      mapping: {0: 'Device Types', 2: 'Market Share of Device Types'}
    }
    // zoom: { //TODO: make stacked bar chart work with zooming!
    //   in: 20,
    //   out: 1
    // }
  },
  parameters: {
    sources: {
      css: { title: 'CSS Code', code: StackedBarChartCSS },
    }
  }
}

export default meta;
