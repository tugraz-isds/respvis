import {BaseAxis, BaseAxisArgs, validateBaseAxis} from "./validate-base-axis";
import {ActiveKeyMap, AxisKey} from "../../constants/types";
import {ParcoordSeries} from "respvis-parcoord";

export type KeyedAxisArgs = BaseAxisArgs & {
  key: AxisKey
  series: ParcoordSeries
}

export type KeyedAxis = BaseAxis & {
  originalAxis: KeyedAxis
  series: ParcoordSeries //If a chart similar to parcoord is integrated, create interface
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
    setKeyActiveIfDefined: function(key: string, value: boolean) {
      if (this.keysActive[key] !== undefined) this.keysActive[key] = value
    },
    isKeyActiveByKey: function(key: string) {
      // noinspection PointlessBooleanExpressionJS
      return this.keysActive[key] !== false
    },
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
