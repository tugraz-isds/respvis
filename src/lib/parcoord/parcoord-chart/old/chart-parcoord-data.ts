import {IChartParcoordArgs} from "./IChartParcoordArgs";
import {IChartParcoordData, TParcoordDimensionData} from "./IChartParcoordData";
import {axisScaledValuesValidation, axisValidation} from "../../../core";
import {scalePoint} from "d3";

export function parcoordData(data: IChartParcoordArgs): IChartParcoordData {
  const {legend, dimensions, title, subTitle, flipped} = data
  const dimensionsValid: TParcoordDimensionData[] = dimensions.map((dimension, index) => {
    const {scale, title, subtitle, styleClass, values, configureAxes} = dimension
    return {
      values: dimension.values,
      scale: scale ? scale : axisScaledValuesValidation(values),
      styleClass: styleClass ? styleClass : `dimension-${index}`,
      axis: axisValidation({
        scale, title, subtitle,
        configureAxis: configureAxes?.[index]
      }),
    }
  })

  const axisScale = scalePoint()
    .domain(dimensionsValid.map((data, index) => index.toString()));

  return {
    dimensions: dimensionsValid,
    axisScale,
    title, subTitle: subtitle, flipped //TODO: Legend
  }
}
