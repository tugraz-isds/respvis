import {BarChart, BarChartUserArgs} from "../../../../../ts";
import type {StoryContext} from "@storybook/html";
import {renderChartMeta} from "../../../util/render-chart-meta";
import {select, Selection} from "d3";

export const renderBarChart = (args: BarChartUserArgs, context: StoryContext<BarChartUserArgs>) => {
  return renderChartMeta(args, context, (args, id) => {
    const chartS: Selection<any, any> = select(`#${id}`)
    const chart = new BarChart(chartS, args)
    chart.buildChart()
  })
}
