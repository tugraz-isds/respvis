import {ChartBaseArgs, ConfigureAxisFn, ScaleAny} from "../../../core";
import {LegendValid} from "../../../core/render/legend";

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
  legend?: LegendValid
}
