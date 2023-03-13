import {ConfigureAxisFn, IChartBaseArgs, ScaleAny} from "../../core";
import {Legend} from "../../legend";

export type TParcoordDimensionArg = {
  values: number[],
  scale?: ScaleAny<any, number, number>
  title?: string,
  subtitle?: string
  configureAxes?: ConfigureAxisFn,
  styleClass?: string
}

export interface IChartParcoordArgs extends IChartBaseArgs {
  dimensions: TParcoordDimensionArg[]
  legend?: Legend
}
