import {LineChart, LineChartUserArgs} from "../../../../../lib";
import type {StoryContext} from "@storybook/html";
import {renderChartMeta} from "../../../util/render-chart-meta";
import {select, Selection} from "d3";

export const renderLineChart = (args: LineChartUserArgs, context: StoryContext<LineChartUserArgs>) => {
  return renderChartMeta(args, context, (args, id) => {
    const chartS: Selection<any, any> = select(`#${id}`)
    const chart = new LineChart(chartS, args)
    chart.buildChart()
  })
}
