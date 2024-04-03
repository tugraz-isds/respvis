import type {Meta, StoryObj} from '@storybook/html';
import {formatWithDecimalZero, LineChart, LineChartUserArgs} from "../../../lib";
import {format, select, Selection} from "d3";
import {students, years} from "../../../examples/linecharts/linechart/data/students-tugraz";
import {renderChartWindow} from "../../util/render-chart-window";
import {RawCSSHandler} from "../../util/raw-css-handler";
import axisTransformations from './line-chart-axis-transformations.css?inline'
import sparkLineTransformation from './line-chart-spark-line.css?inline'
import {applyMarkerTooltipsFunction, applyXAxisFormatFunctions, applyYAxisFormatFunctions} from "./apply-function-args";

let onDocumentLoad: (e) => void
const renderChartElementMeta = (args: LineChartUserArgs) => {
  const {chartWindow, id} = renderChartWindow()
  document.removeEventListener("DOMContentLoaded", onDocumentLoad)
  onDocumentLoad = () => {
    const chartS: Selection<any, any> = select(`#${id}`)
    const lineChart = new LineChart(chartS, args)
    lineChart.buildChart()
  }
  document.addEventListener("DOMContentLoaded", onDocumentLoad)
  return chartWindow
}

const tags = {
  axisTransformation: new RawCSSHandler(axisTransformations),
  sparkLineTransformation: new RawCSSHandler(sparkLineTransformation)
}
function removeCSSTagsFromDOM() {
  Object.values(tags).forEach(handler => {
    handler.removeFromHead()
  })
}


type Story = StoryObj<LineChartUserArgs>;

export const LineChartBasic: Story = {
  args: {
    series: {
      x: {values: years},
      y: {values: students},
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

export const LineChartAxisTransformations: Story = {
  args: {
    ...LineChartBasic.args,
    bounds: {
      width: {
        values: [20, 30, 50],
        unit: 'rem'
      }
    },
  },
  render: args => {
    removeCSSTagsFromDOM()
    tags.axisTransformation.addToHead()
    applyMarkerTooltipsFunction(args)
    applyYAxisFormatFunctions(args)
    applyXAxisFormatFunctions(args)
    return renderChartElementMeta(args)
  }
}

export const LineChartSparkLineTransformation: Story = {
  args: {
    ...LineChartBasic.args,
  },
  render: args => {
    removeCSSTagsFromDOM()
    tags.sparkLineTransformation.addToHead()
    applyMarkerTooltipsFunction(args)
    applyYAxisFormatFunctions(args)
    applyXAxisFormatFunctions(args)
    return renderChartElementMeta(args)
  }
}

export const LineChartResponsiveLabels: Story = {
  args: {
    ...LineChartAxisTransformations.args,
    title: {
      dependentOn: 'width',
      mapping: {0: 'Registered Students', 1: 'Students at TU Graz', 3: 'Students Registered at TU Graz'}
    },
    subTitle: {
      dependentOn: 'width',
      mapping: {0: 'TU Graz', 1: ''}
    },
    y: { ...LineChartAxisTransformations.args!.y,
      configureAxis: {
        dependentOn: 'width',
        scope: 'chart',
        mapping: {0: (axis) => axis.tickFormat(formatWithDecimalZero(format('.2s'))),
          2: (axis) => axis.tickFormat(formatWithDecimalZero(format(',')))
        }
      }
    },
  },
  render: args => {
    removeCSSTagsFromDOM()
    tags.sparkLineTransformation.addToHead()
    applyMarkerTooltipsFunction(args)
    applyYAxisFormatFunctions(args)
    applyXAxisFormatFunctions(args)
    return renderChartElementMeta(args)
  }
}

export const LineChartFlipping: Story = {
  args: { ...LineChartResponsiveLabels.args,
    series: {
      ...LineChartResponsiveLabels.args!.series!,
      flipped: {
        dependentOn: 'width',
        mapping: {0: true, 2: false}
      }
    }
  },
  render: args => {
    removeCSSTagsFromDOM()
    tags.sparkLineTransformation.addToHead()
    applyMarkerTooltipsFunction(args)
    applyYAxisFormatFunctions(args)
    applyXAxisFormatFunctions(args)
    return renderChartElementMeta(args)
  }
}

export const LineChartZoomable: Story = {
  args: { ...LineChartFlipping.args,
    zoom: {
      in: 20,
      out: 1
    }
  },
  render: args => {
    removeCSSTagsFromDOM()
    tags.sparkLineTransformation.addToHead()
    applyMarkerTooltipsFunction(args)
    applyYAxisFormatFunctions(args)
    applyXAxisFormatFunctions(args)
    return renderChartElementMeta(args)
  }
}

const meta = {
  title: 'Charts/Line Chart',
  // tags: ['autodocs'],
  parameters: {
    docs: {
      story: {
        inline: false,
        height: 400
      },
    },
  },
  render: (args) => {
    removeCSSTagsFromDOM()
    return renderChartElementMeta(args)
  }
} satisfies Meta<LineChartUserArgs>;

export default meta;
