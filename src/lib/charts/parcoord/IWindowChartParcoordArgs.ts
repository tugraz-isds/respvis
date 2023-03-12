import {IWindowChartBaseArgs, ScaleAny} from "../../core";
import {Legend} from "../../legend";

export interface IWindowChartParcoordArgs extends IWindowChartBaseArgs {
  dimensions: number[][]; //TODO: add strings/dates, also for y
  scales?: ScaleAny<any, number, number>[];
  styleClasses?: string[];
  legend?: Legend;
}
