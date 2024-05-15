import type {StoryContext} from "@storybook/html";
import {renderChartMeta} from "../../render/render-chart-meta";
import {select, Selection} from "d3";
import {AxisChart} from "./axis-chart";
import {AxisChartUserArgs} from "./axis-chart-validation";

export const renderChart = (args: AxisChartUserArgs, context: StoryContext<AxisChartUserArgs>) => {
  return renderChartMeta(args, context, (args, id) => {
    const chartS: Selection<any, any> = select(`#${id}`)
    const chart = new AxisChart(chartS, args)
    chart.buildChart()
  })
}
