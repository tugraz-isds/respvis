import {Axis as D3Axis, AxisDomain} from 'd3';
import {RenderArgs} from "../chart";
import {DataSeries} from "../data-series";
import {ScaledValuesSpatial} from "../../data/scale";
import {LightWeightAxis, LightWeightAxisUserArgs, validateLightWeightAxis} from "./validate-lightweight-axis";
import type {KeyedAxis} from "../../../../respvis-parcoord/ts/render/validate-keyed-axis";
import type {CartesianAxis} from "../../../../respvis-cartesian/ts/render/validate-cartesian-axis";

export type BaseAxisUserArgs = LightWeightAxisUserArgs

export type BaseAxisArgs = BaseAxisUserArgs & RenderArgs & {
  scaledValues: ScaledValuesSpatial
  series: DataSeries
}

export type BaseAxis = LightWeightAxis & {
  originalAxis: BaseAxis,
  series: DataSeries
  d3Axis?: D3Axis<any> //axis available after first render
}

export type Axis = BaseAxis | CartesianAxis | KeyedAxis

export interface ConfigureAxisFn {
  (axis: D3Axis<AxisDomain>): void;
}

export function validateBaseAxis(args: BaseAxisArgs): BaseAxis {
  const axis: BaseAxis = {
    ...validateLightWeightAxis(args),
    originalAxis: this,
    series: args.series
  }
  axis.originalAxis = axis
  return axis
}
