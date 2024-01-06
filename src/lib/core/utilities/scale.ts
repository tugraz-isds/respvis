import {
  AxisDomain,
  AxisScale,
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

export function validateScale(values: number[] | unknown[], scale?: AxisScale<AxisDomain>) {
  if (scale) return scale
  let scaleValid : ScaleAny<number | string | Date, number, number> = scaleLinear().domain([0, 1]);
  if (values.length > 0) {
    if (typeof values[0] === 'number') {
      const valuesNum = values.map(value => Number(value))
      const extent = [Math.min(...valuesNum), Math.max(...valuesNum)];
      const range = extent[1] - extent[0];
      const domain = [extent[0] - range * 0.05, extent[1] + range * 0.05];
      scaleValid = scaleLinear().domain(domain).nice();
    } else if (typeof values[0] === 'string') {
      const valuesStr = values.map(value => value.toString())
      scaleValid = scalePoint().domain(valuesStr);
    }
  }
  return scaleValid
}
