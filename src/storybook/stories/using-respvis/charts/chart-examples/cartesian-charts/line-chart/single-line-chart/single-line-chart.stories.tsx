import type {Meta, StoryObj} from '@storybook/html';
import {LineChartUserArgs} from "respvis-line";
import {formatWithDecimalZero} from "respvis-core"
import {format} from "d3";
import axisTransformations from './single-line-chart-axis-transformations.css?inline'
import sparkLineTransformation from './single-line-chart-spark-line.css?inline'
import {rawCode} from "../../../../../../util/raw-code";
import {StudentTUGrazData} from 'data'
import {renderLineChart} from "../../../../../../util/render/render-line.chart";

const {students, years} = StudentTUGrazData

const meta = {
  title: 'Using RespVis/Charts/Chart Examples/Cartesian Charts/Line Charts/Single Line Chart',
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
  render: renderLineChart
} satisfies Meta<LineChartUserArgs>;

type Story = StoryObj<LineChartUserArgs>;

export const Basic: Story = {
  name: 'Basic',
  args: {
    series: {
      x: {values: years},
      y: {values: students},
      markerTooltipGenerator: {
        tooltips: function(_, {xValue, yValue}) {
          return `Year: ${xValue}<br/>Students: ${format('.2f')(yValue)}`
        }
      }
    },
    title: 'Students Registered at TU Graz',
    subTitle: 'TU Graz',
    x: {
      title: 'Year',
      subTitle: '[2012 to 2021]'
    },
    y: {
      title: 'Students',
      subTitle: '[Winter Semester]',
    },
  },
}

export const SimpleAxisThinning: Story = {
  name: 'Simple: Thinning out Axes',
  args: {
    ...Basic.args,
    y: { ...Basic.args!.y,
      configureAxis: {
        dependentOn: 'width',
        scope: 'chart',
        mapping: {
          0: (axis) => axis.tickFormat(formatWithDecimalZero(format('.2s'))),
          2: (axis) => axis.tickFormat(formatWithDecimalZero(format(',')))
        }
      },
    },
    breakPoints: {
      width: {
        values: [20, 30, 50],
        unit: 'rem'
      }
    },
  },
  parameters: {
    sources: {
      css: { title: 'CSS Code', code: axisTransformations },
    }
  }
}

export const SimpleSparkLine: Story = {
  name: 'Simple: Spark Line',
  args: {
    ...Basic.args,
  },
  parameters: {
    sources: {
      css: { title: 'CSS Code', code: sparkLineTransformation },
    }
  }
}

export const SimpleResponsiveLabels: Story = {
  name: 'Simple: Responsive Labels',
  args: {
    ...SimpleAxisThinning.args,
    title: {
      dependentOn: 'width',
      mapping: {0: 'Registered Students', 1: 'Students at TU Graz', 3: 'Students Registered at TU Graz'}
    },
    subTitle: {
      dependentOn: 'width',
      mapping: {0: 'TU Graz', 1: ''}
    },
  },
  parameters: {
    sources: {
      css: { title: 'CSS Code', code: sparkLineTransformation },
    }
  }
}

export const SimpleFlipping: Story = {
  args: { ...SimpleAxisThinning.args,
    series: {
      ...SimpleResponsiveLabels.args!.series!,
      flipped: {
        dependentOn: 'width',
        mapping: {0: true, 2: false}
      }
    }
  },
  parameters: {
    sources: {
      css: { title: 'CSS Code', code: sparkLineTransformation },
    }
  }
}

const LineChartZoomableArgs = { ...SimpleFlipping.args,
    series: { ...SimpleFlipping.args!.series!,
      zoom: {
        in: 20,
        out: 1
      }
    }
  }

export const LineChartZoomable: Story = {
  name: 'Simple: Zoomable',
  args: LineChartZoomableArgs,
  parameters: {
    sources: {
      css: { title: 'CSS Code', code: sparkLineTransformation },
    }
  }
}

export const Primary: Story = {
  name: 'Fully Responsive',
  args: {...LineChartZoomableArgs,
    x: {...LineChartZoomableArgs.x,
      gridLineFactor: 2
    },
    y: {...LineChartZoomableArgs.y,
      gridLineFactor: 1
    }
  },
  parameters: {
    sources: {
      css: { title: 'CSS Code', code: sparkLineTransformation },
    }
  }
}

export default meta;
