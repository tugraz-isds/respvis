import {
  ScaleBand,
  ScaleContinuousNumeric, ScaleLinear,
  ScaleOrdinal,
  ScalePoint,
  ScaleQuantile,
  ScaleQuantize,
  ScaleThreshold,
  ScaleTime
} from "d3";
import {ToArray} from "../../constants/types";
import {AxisDomainRV} from "./axis-scaled-values-validation";
import {ScaledValuesCategoricalValid, ScaledValuesDateValid, ScaledValuesLinearValid} from "./scaled-values";
import {NumberValue} from "d3-scale";

export type ScaleBase<T extends AxisDomainRV> =
  T extends Date ? ScaleTime<number, number, never> :
    T extends number ? ScaleLinear<number, number, never> :
    T extends string ? ScaleBand<string> : never

export type ScaleContinuous<TRange, TOutput> =
  | ScaleContinuousNumeric<TRange, TOutput>
  | ScaleTime<TRange, TOutput>
export type ScaleAny<TDomain extends string | number | Date, TRange, TOutput> = //TODO: ScaleAny only accepts number or any input. Fix this!
// continuous input and continuous output
  | ScaleContinuous<TRange, TOutput>
  // continuous input and discrete output
  | ScaleQuantize<TRange>
  | ScaleQuantile<TRange>
  | ScaleThreshold<TDomain, TRange>
  // discrete input and discrete output
  | ScaleOrdinal<TDomain, TRange>
  | ScaleBand<TDomain>
  | ScalePoint<TDomain>;
