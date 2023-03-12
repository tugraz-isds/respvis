import {ConfigureAxisFn, IWindowChartBaseArgs, ScaleAny} from "../../core";
import {Legend} from "../../legend";

export interface IWindowChartParcoordArgs extends IWindowChartBaseArgs {
  dimensions: number[][] //TODO: add strings/dates, also for y
  scales?: ScaleAny<any, number, number>[]
  titles?: string[]
  subtitles?: string[]
  configureAxes?: ConfigureAxisFn[]
  styleClasses?: string[]
  legend?: Legend
}
