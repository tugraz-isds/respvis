import {ConfigureAxisFn, ChartBaseArgs, ScaleAny} from "../../core";
import {Legend} from "../../legend";

export type TParcoordDimensionArg = {
  values: number[],
  scale?: ScaleAny<any, number, number>
  title?: string,
  subtitle?: string
  configureAxes?: ConfigureAxisFn,
  styleClass?: string
}

export interface IChartParcoordArgs extends ChartBaseArgs {
  dimensions: TParcoordDimensionArg[]
  legend?: Legend
}
