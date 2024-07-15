import {BaseAxis, BaseAxisArgs, Key, KeyedAxisPrefix, validateBaseAxis} from "respvis-core";
import type {ParcoordSeries} from "./index";

export type KeyedAxisArgs = BaseAxisArgs & {
  key: number
  series: ParcoordSeries
}

export type KeyedAxis = BaseAxis & {
  originalAxis: KeyedAxis
  //If a chart similar to parcoord is integrated, create interface
  //Current Solution is also bad as type must be imported from parcoord-package
  series: ParcoordSeries
  key: Key<KeyedAxisPrefix>
  upperRangeLimitPercent: number
  lowerRangeLimitPercent: number
  isValueInRangeLimit: (val: any) => boolean
}

export function validateKeyedAxis(args:KeyedAxisArgs): KeyedAxis {
  const axis = {
    ...validateBaseAxis(args),
    originalAxis: this,
    series: args.series,
    key: new Key('ak', [args.key]),
    upperRangeLimitPercent: 1,
    lowerRangeLimitPercent: 0,
    isValueInRangeLimit: function (val: number) {
      const axisIndex = this.series.axes.findIndex(axis => axis.key === this.key)
      const flipped = this.series.responsiveState.currentlyFlipped
      const inverted = this.series.axesInverted[axisIndex]
      // this.series.
      const scaledValues = this.scaledValues
      const range = scaledValues.scale.range()
      if (flipped) {
        const rangeMax = inverted ? range[0] : range[1]
        const maxRangeGraphical = rangeMax * this.upperRangeLimitPercent
        const minRangeGraphical = rangeMax * this.lowerRangeLimitPercent
        return val >= minRangeGraphical && val <= maxRangeGraphical
      }
      const rangeMax = inverted ? range[1] : range[0]
      const maxRangeGraphical = rangeMax - rangeMax * this.upperRangeLimitPercent
      const minRangeGraphical = rangeMax - rangeMax * this.lowerRangeLimitPercent
      return val <= minRangeGraphical && val >= maxRangeGraphical
    }
  }
  axis.originalAxis = axis
  return axis
}
