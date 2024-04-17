import type {Meta, StoryObj} from '@storybook/html';
import {LineChartUserArgs} from "../../../../../lib";
import {format} from "d3";
import {rawCode} from "../../../util/raw-code";
import {PowerConsumptionData} from '../../data'
import {renderLineChart} from "../render-line.chart";
import FullyResponsiveCSS from './multi-line-chart.css?inline'

const {yUSA, yEurope, yAsia, years} = PowerConsumptionData.mapPowerConsumptionData()
const categories = [
  ...yUSA.map(() => 'USA'),
  ...yEurope.map(() => 'Europe'),
  ...yAsia.map(() => 'Asia')]

const meta = {
  title: 'Charts/Line Charts/Multi Line Chart',
  parameters: {
    docs: {
      story: {
        inline: false,
        height: 400
      },
    },
    sources: {
      js: { title: 'JS Code', code: (args: object) => rawCode({args}) }
    }
  },
  render: renderLineChart
} satisfies Meta<LineChartUserArgs>;

type Story = StoryObj<LineChartUserArgs>;

export const FullyResponsive: Story = {
  name: 'Fully Responsive',
  args: {
    series: {
      x: {values: [...years, ...years, ...years]},
      y: {values: [...yUSA, ...yEurope, ...yAsia]},
      categories: {
        values: categories,
        title: 'Continents'
      },
      markerTooltips: {
        tooltips: (_, point) => {
          return `Year: ${point.xValue}<br/>Pow. Consumption: ${point.yValue}kWh`
        }
      },
      flipped: {
        dependentOn: 'width',
        mapping: {0: true, 2: false}
      },
      zoom: {
        in: 20,
        out: 1
      }
    },
    bounds: {
      width: {
        values: [25, 30, 50],
        unit: 'rem'
      }
    },
    title: {
      dependentOn: 'width',
      mapping: {0: 'Power (kWh)', 1: 'Power Consumption (kWh)', 3: 'Electric Power Consumption (kWh per Capita)'}
    },
    subTitle: {
      dependentOn: 'width',
      mapping: {0: 'TU Graz', 1: ''}
    },
    x: {
      title: 'Year',
      subTitle: '[2012 to 2021]',
      tickOrientation: {
        dependentOn: 'width',
        scope: 'self',
        mapping: {0: 90, 3: 0},
      },
      bounds: {
        width: {
          values: [10, 30, 50],
          unit: 'rem'
        }
      },
      // configureAxis: (axis) => axis.tickFormat((v) => v),
      configureAxis: (axis) => axis.tickFormat(format('.3d'))
    },
    y: {
      title: 'Consumption',
      bounds: {
        width: {
          values: [10, 30, 50],
          unit: 'rem'
        }
      },
      tickOrientationFlipped: {
        dependentOn: 'width',
        scope: 'self',
        mapping: {0: 90, 3: 0},
      },
    }
  },
  parameters: {
    sources: {
      css: { title: 'CSS Code',  code: FullyResponsiveCSS }
    }
  }
}

// export const SimpleAxisThinning: Story = {
//   name: 'Simple: Thinning out Axes',
//   args: {
//     ...Basic.args,
//     y: { ...Basic.args!.y,
//       configureAxis: {
//         dependentOn: 'width',
//         scope: 'chart',
//         mapping: {
//           0: (axis) => axis.tickFormat(formatWithDecimalZero(format('.2s'))),
//           2: (axis) => axis.tickFormat(formatWithDecimalZero(format(',')))
//         }
//       },
//     },
//     bounds: {
//       width: {
//         values: [20, 30, 50],
//         unit: 'rem'
//       }
//     },
//   },
//   parameters: {
//     sources: {
//       css: { title: 'CSS Code', code: axisTransformations },
//     }
//   }
// }
//
// export const SimpleSparkLine: Story = {
//   name: 'Simple: Spark Line',
//   args: {
//     ...Basic.args,
//   },
//   parameters: {
//     sources: {
//       css: { title: 'CSS Code', code: sparkLineTransformation },
//     }
//   }
// }
//
// export const SimpleResponsiveLabels: Story = {
//   name: 'Simple: Responsive Labels',
//   args: {
//     ...SimpleAxisThinning.args,
//     title: {
//       dependentOn: 'width',
//       mapping: {0: 'Registered Students', 1: 'Students at TU Graz', 3: 'Students Registered at TU Graz'}
//     },
//     subTitle: {
//       dependentOn: 'width',
//       mapping: {0: 'TU Graz', 1: ''}
//     },
//   },
//   parameters: {
//     sources: {
//       css: { title: 'CSS Code', code: sparkLineTransformation },
//     }
//   }
// }
//
// export const SimpleFlipping: Story = {
//   args: { ...SimpleAxisThinning.args,
//     series: {
//       ...SimpleResponsiveLabels.args!.series!,
//       flipped: {
//         dependentOn: 'width',
//         mapping: {0: true, 2: false}
//       }
//     }
//   },
//   parameters: {
//     sources: {
//       css: { title: 'CSS Code', code: sparkLineTransformation },
//     }
//   }
// }
//
// const LineChartZoomableArgs = { ...SimpleFlipping.args,
//     series: { ...SimpleFlipping.args!.series!,
//       zoom: {
//         in: 20,
//         out: 1
//       }
//     }
//   }
//
// export const LineChartZoomable: Story = {
//   name: 'Simple: Zoomable',
//   args: LineChartZoomableArgs,
//   parameters: {
//     sources: {
//       css: { title: 'CSS Code', code: sparkLineTransformation },
//     }
//   }
// }
//
// export const Primary: Story = {
//   name: 'Fully Responsive',
//   args: LineChartZoomableArgs,
//   parameters: {
//     sources: {
//       css: { title: 'CSS Code', code: sparkLineTransformation },
//     }
//   }
// }

export default meta;
