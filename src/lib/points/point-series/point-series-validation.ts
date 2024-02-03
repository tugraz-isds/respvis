import {getRadiusDefinite} from "../../core/data/radius/radius-util";
import {elementFromSelection} from "../../core/utilities/d3/util";
import {RadiusArg} from "../../core/data/radius/radius-validation";
import {
  getSeriesItemCategoryData,
  SeriesArgs,
  SeriesUserArgs,
  SeriesValid,
  seriesValidation
} from "../../core/render/series";
import {Point} from "./point";
import {ColorContinuous} from "../../core/data/color-continuous/color-continuous";
import {
  isScaledValuesCategorical,
  ScaledValuesCategoricalValid,
  ScaledValuesLinearUserArgs
} from "../../core/data/scale/scaled-values";
import {AxisScaledValuesValid, getFilteredScaledValues} from "../../core";
import {getCurrentRespVal} from "../../core/data/responsive-value/responsive-value";

export type SeriesPointUserArgs = SeriesUserArgs & {
  radii?: RadiusArg
  color?: ColorContinuous
}

export type SeriesPointArgs = SeriesPointUserArgs & SeriesArgs

export type SeriesPointValid = SeriesValid & {
  color?: ColorContinuous
  radii: RadiusArg
}

export function seriesPointValidation(data: SeriesPointArgs): SeriesPointValid {
  const {radii, color} = data
  //TODO: Do clean radius validation
  return {
    ...seriesValidation(data),
    radii: radii !== undefined ? radii : 5,
    color,
  };
}

export function seriesPointCreatePoints(seriesData: SeriesPointValid): Point[] {
  const { x, y,
    key: seriesKey, keysActive,
    radii, color, renderer } = seriesData
  const chartElement = elementFromSelection(renderer.chartSelection)
  const flipped = getCurrentRespVal(seriesData.flipped, {chart: chartElement})

  if (!keysActive[seriesKey]) return []
  const data: Point[] = []
  const drawAreaElement = elementFromSelection(renderer.drawAreaSelection)
  const radiusDefinite = getRadiusDefinite(radii, {chart: chartElement, self: drawAreaElement})
  for (let i = 0; i < x.values.length; i++) {
    const xFlipped = flipped ? y : x
    const yFlipped = flipped ? x : y
    const r = typeof radiusDefinite === "number" ? radiusDefinite : radiusDefinite.scale(radiusDefinite.values[i])

    const {key, seriesCategory, styleClass, label,
      axisCategoryKeyX, axisCategoryKeyY} = getSeriesItemCategoryData({...seriesData, index: i, flipped})

    if (keysActive[seriesCategory] === false) continue
    if (isScaledValuesCategorical(x) && x.keysActive[axisCategoryKeyX] === false ||
      isScaledValuesCategorical(y) && y.keysActive[axisCategoryKeyY] === false) continue

    const calcGraphicValue = (scaledValues: AxisScaledValuesValid, index: number) => {
      if (isScaledValuesCategorical(scaledValues)) {
        const {scale, values} = getFilteredScaledValues(scaledValues) as ScaledValuesCategoricalValid
        return scale(values[index])! + scale.bandwidth() / 2
      }
      const {scale, values} = getFilteredScaledValues(scaledValues) as Required<ScaledValuesLinearUserArgs>
      return scale(values[index])!
    }
    const xVal = xFlipped.values[i]
    const xGraphVal = calcGraphicValue(xFlipped, i)
    const yVal = yFlipped.values[i]
    const yGraphVal = calcGraphicValue(yFlipped, i)

    data.push({
      label, styleClass, key,
      center: {
        x: xGraphVal,
        y: yGraphVal,
      },
      radius: r ?? 5,
      xValue: xVal,
      yValue: yVal,
      color: color?.scale(color?.values[i]),
      radiusValue: typeof radiusDefinite !== "number" ? radiusDefinite.values[i] : undefined
    })
  }

  return data;
}


