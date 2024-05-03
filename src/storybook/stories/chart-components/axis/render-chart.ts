import type {StoryContext} from "@storybook/html";
import {renderChartMeta} from "../../util/render-chart-meta";
import {select, Selection} from "d3";
import {AxisChart} from "../example-extensions/axis-chart/axis-chart";
import {AxisChartUserArgs} from "../example-extensions/axis-chart/axis-chart-validation";

export const renderChart = (args: AxisChartUserArgs, context: StoryContext<AxisChartUserArgs>) => {
  return renderChartMeta(args, context, (args, id) => {
    const chartS: Selection<any, any> = select(`#${id}`)
    const chart = new AxisChart(chartS, args)
    chart.buildChart()
  })
}
