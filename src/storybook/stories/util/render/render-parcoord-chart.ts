import {ParcoordChart, ParcoordChartUserArgs} from "../../../../packages";
import type {StoryContext} from "@storybook/html";
import {renderChartMeta} from "./render-chart-meta";
import {select, Selection} from "d3";

export const renderParcoordChart = (args: ParcoordChartUserArgs, context: StoryContext<ParcoordChartUserArgs>) => {
  return renderChartMeta(args, context, (args, id) => {
    const chartS: Selection<any, any> = select(`#${id}`)
    const chart = new ParcoordChart(chartS, args)
    chart.buildChart()
  })
}
