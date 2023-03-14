import {
  ScaleBand,
  ScaleContinuousNumeric,
  scaleLinear,
  ScaleOrdinal,
  scalePoint,
  ScalePoint,
  ScaleQuantile,
  ScaleQuantize,
  ScaleThreshold,
  ScaleTime,
} from 'd3';

export type ScaleContinuous<TRange, TOutput> =
  | ScaleContinuousNumeric<TRange, TOutput>
  | ScaleTime<TRange, TOutput>;

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

export function calcDefaultScale(values: any[]) {
  let scale : ScaleAny<any, number, number> = scaleLinear().domain([0, 1]);
  if (values.length > 0) {
    if (typeof values[0] === 'number') {
      const extent = [Math.min(...values), Math.max(...values)];
      const range = extent[1] - extent[0];
      const domain = [extent[0] - range * 0.05, extent[1] + range * 0.05];
      scale = scaleLinear().domain(domain).nice();
    } else {
      scale = scalePoint().domain(values);
    }
  }
  return scale
}
