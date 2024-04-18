import {ScatterPlot, ScatterPlotUserArgs} from "../../../../lib";
import type {StoryContext} from "@storybook/html";
import {renderChartMeta} from "../../util/render-chart-meta";
import {select, Selection} from "d3";

export const renderScatterplot = (args: ScatterPlotUserArgs, context: StoryContext<ScatterPlotUserArgs>) => {
  return renderChartMeta(args, context, (args, id) => {
    const chartS: Selection<any, any> = select(`#${id}`)
    const chart = new ScatterPlot(chartS, args)
    chart.buildChart()
  })
}
