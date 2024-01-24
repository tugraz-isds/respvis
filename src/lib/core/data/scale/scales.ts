import {
  ScaleBand,
  ScaleContinuousNumeric,
  ScaleOrdinal,
  ScalePoint,
  ScaleQuantile,
  ScaleQuantize,
  ScaleThreshold,
  ScaleTime
} from "d3";

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
