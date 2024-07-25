import {
  alignScaledValuesLengths,
  combineKeys,
  DataSeriesArgs,
  DataSeriesData,
  DataSeriesUserArgs,
  ErrorMessages,
  ScaledValuesCategorical,
  ScaledValuesSpatial,
  ScaledValuesSpatialDomain,
  ScaledValuesSpatialUserArgs,
  validateDataSeriesArgs,
  validateScaledValuesSpatial,
  validateZoom,
  Zoom,
  ZoomArgs
} from "respvis-core";
import {CartesianSeries} from "./cartesian-series";
import {CartesianRenderer} from "../cartesian-chart";

export type CartesianSeriesUserArgs = DataSeriesUserArgs & {
  x: ScaledValuesSpatialUserArgs<ScaledValuesSpatialDomain>
  y: ScaledValuesSpatialUserArgs<ScaledValuesSpatialDomain>
  zoom?: ZoomArgs
}
export type CartesianSeriesArgs = DataSeriesArgs & CartesianSeriesUserArgs & {
  original?: CartesianSeries
  renderer: CartesianRenderer
}
export type CartesianSeriesData = DataSeriesData & {
  x: ScaledValuesSpatial
  y: ScaledValuesSpatial
  zoom?: Zoom
}

export function validateCartesianSeriesArgs(args: CartesianSeriesArgs) {
  const [xAligned, yAligned] =
    alignScaledValuesLengths(args.x, args.y)

  const data = {
    ...validateDataSeriesArgs(args),
    x: validateScaledValuesSpatial(xAligned, 'a-0'),
    y: validateScaledValuesSpatial(yAligned, 'a-1'),
    zoom: args.zoom ? validateZoom(args.zoom) : undefined,
    getCombinedKey(this: CartesianSeriesData, i: number) {
      const xKey = this.x instanceof ScaledValuesCategorical ? this.x.getCategoryData(i).combinedKey : undefined
      const yKey = this.y instanceof ScaledValuesCategorical ? this.y.getCategoryData(i).combinedKey : undefined
      const seriesCategoryKey = this.categories ? this.categories.getCategoryData(i).combinedKey : undefined
      return combineKeys([this.key, seriesCategoryKey, xKey, yKey])
    }
  }

  if (data.categories && data.categories.values.length !== data.x.values.length) {
    throw new Error(ErrorMessages.categoricalValuesMismatch)
  }

  if (data.color && data.color.values.length !== data.x.values.length) {
    throw new Error(ErrorMessages.sequentialColorValuesMismatch)
  }

  return data
}

export function cloneCartesianSeriesData<D extends CartesianSeriesData>(original: D): D {
  return {...original,
    x: original.x.clone(),
    y: original.y.clone(),
  }
}
