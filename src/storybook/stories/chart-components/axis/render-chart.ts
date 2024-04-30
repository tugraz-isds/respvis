import {ChartUserArgs} from "../../../../lib";
import type {StoryContext} from "@storybook/html";
import {renderChartMeta} from "../../util/render-chart-meta";
import {select, Selection} from "d3";
import {AxisChart} from "./axis-chart";

export const renderChart = (args: ChartUserArgs, context: StoryContext<ChartUserArgs>) => {
  return renderChartMeta(args, context, (args, id) => {
    const chartS: Selection<any, any> = select(`#${id}`)
    const chart = new AxisChart(chartS, args)
    chart.buildChart()
  })
}
