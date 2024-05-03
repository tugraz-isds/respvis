import {
  desktop,
  desktopCategory,
  phone,
  phoneCategory,
  tablet,
  tabletCategory,
  years
} from './data/desktop-phone-tablet.js';
import * as d3 from './libs/d3-7.6.0/d3.js'
import {BarChart, BarChartUserArgs} from './libs/respvis/respvis.js';

export function renderStackedBarChart(selector: string) {
  const yearsWhole = [...years, ...years, ...years]
  const sharesWhole = [...desktop, ...phone, ...tablet]
  const platformsWhole = [...desktopCategory, ...phoneCategory, ...tabletCategory]

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
  const barChartArgs: BarChartUserArgs = {
    series: {
      type: 'stacked',
      aggregationScale: d3.scaleLinear().domain([0, 100]).nice(),
      x: { values: yearsWhole },
      y: { values: sharesWhole },
      categories: {
        values: platformsWhole,
        title: 'Device Types'
      },
      markerTooltips: {
        tooltips: ((e, d) => {
          return `Device Type: ${d.tooltipLabel}<br/>
                Market Share: ${d3.format(',')(d.yValue)}%<br/>
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
          const labelFormatted = d3.format('.2s')(label)
          return ((bar.width <= 20 && labelFormatted.length > 2)
            || bar.height <= 15) ? '' : labelFormatted
        }
      }
    },
    breakPoints: {
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
      breakPoints: {
        width: axisBreakPointsWidth,
        height: axisBreakPointsHeight
      },
      // tickOrientation: tickOrientationHorizontal,
      // tickOrientationFlipped: tickOrientationVertical
    },
    y: {
      title: 'Market Share',
      configureAxis: (a) => a.tickFormat((v) => `${v}%`),
      breakPoints: {
        height: axisBreakPointsHeight,
        width: axisBreakPointsWidth
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
  }

  const chartWindow = d3.select(selector).append('div')
  const renderer = new BarChart(chartWindow, barChartArgs)
  renderer.buildChart()
}
