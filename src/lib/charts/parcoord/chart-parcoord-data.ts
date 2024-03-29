import {IChartParcoordArgs} from "./IChartParcoordArgs";
import {IChartParcoordData, TParcoordDimensionData} from "./IChartParcoordData";
import {axisData, calcDefaultScale} from "../../core";
import {scalePoint} from "d3";

export function parcoordData(data: IChartParcoordArgs): IChartParcoordData {
  const {legend, dimensions, title, subtitle, flipped} = data
  const dimensionsValid: TParcoordDimensionData[] = dimensions.map((dimension, index) => {
    const {scale, title, subtitle, styleClass, values, configureAxes} = dimension
    return {
      values: dimension.values,
      scale: scale ? scale : calcDefaultScale(values),
      styleClass: styleClass ? styleClass : `dimension-${index}`,
      axis: axisData({
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
    title, subtitle, flipped //TODO: Legend
  }
}
