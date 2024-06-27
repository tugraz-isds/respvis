import {Axis as D3Axis, AxisDomain} from 'd3';
import {RenderArgs} from "../chart/renderer";
import {KeyedAxis} from "respvis-parcoord/render/validate-keyed-axis";
import type {CartesianAxis} from "respvis-cartesian/render";
import {Series} from "../series";
import {LightWeightAxis, LightWeightAxisUserArgs, validateLightWeightAxis} from "./validate-lightweight-axis";
import {ScaledValuesSpatial} from "../../data";

export type BaseAxisUserArgs = LightWeightAxisUserArgs

export type BaseAxisArgs = BaseAxisUserArgs & RenderArgs & {
  scaledValues: ScaledValuesSpatial
  series: Series
}

export type BaseAxis = LightWeightAxis & {
  originalAxis: BaseAxis,
  series: Series
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
