import {ActiveKeyMap, AxisKey, BaseAxis, BaseAxisArgs, validateBaseAxis} from "respvis-core";
import type {ParcoordSeries} from "./index";

export type KeyedAxisArgs = BaseAxisArgs & {
  key: AxisKey
  series: ParcoordSeries
}

export type KeyedAxis = BaseAxis & {
  originalAxis: KeyedAxis
  //If a chart similar to parcoord is integrated, create interface
  //Current Solution is also bad as type must be imported from parcoord-package
  series: ParcoordSeries
  key: AxisKey
  keysActive: ActiveKeyMap
  setKeyActiveIfDefined: (key: string, value: boolean) => void
  isKeyActiveByKey: (key: string) => boolean
  upperRangeLimitPercent: number
  lowerRangeLimitPercent: number
  isValueInRangeLimit: (val: any) => boolean
}

export function validateKeyedAxis(args:KeyedAxisArgs): KeyedAxis {
  const keysActive = {}
  keysActive[args.key] = true

  const axis = {
    ...validateBaseAxis(args),
    originalAxis: this,
    series: args.series,
    key: args.key,
    keysActive,
    upperRangeLimitPercent: 1,
    lowerRangeLimitPercent: 0,
    setKeyActiveIfDefined: function(this: KeyedAxis, key: string, value: boolean) {
      if (this.keysActive[key] !== undefined) this.keysActive[key] = value
    },
    isKeyActiveByKey: function(this: KeyedAxis, key: string) {
      // noinspection PointlessBooleanExpressionJS
      return this.keysActive[key] !== false
    },
    isValueInRangeLimit: function (this: KeyedAxis, val: number) {
      const {axes, axesInverted} = this.series.renderData
      const axisIndex = axes.findIndex(axis => axis.key === this.key)
      const flipped = this.series.responsiveState.currentlyFlipped
      const inverted = axesInverted[axisIndex]

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
