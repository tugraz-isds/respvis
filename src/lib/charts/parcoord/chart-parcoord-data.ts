import {IWindowChartParcoordArgs} from "./IWindowChartParcoordArgs";
import {IChartParcoordData} from "./IChartParcoordData";
import {axisData, calcDefaultScale} from "../../core";
import {scalePoint} from "d3";

export function parcoordData(data: IWindowChartParcoordArgs): IChartParcoordData {
  const {scales, styleClasses, legend, dimensions, titles, subtitles, configureAxes} = data
  const scalesValid = scales ? scales : dimensions.map(dimension => calcDefaultScale(dimension))
  const styleClassesValid = styleClasses ? styleClasses : dimensions[0].map((dimensions, index) => `categorical-${index}`)
  const axes = scalesValid.map((scale, index) => {
    return axisData({
      scale,
      title: titles?.[index] ?? '',
      configureAxis: configureAxes?.[index]
    })
  })

  const axisScale = scalePoint()
    .domain(axes.map((axis, index) => index.toString()));

  return {
    dimensions,
    scales: scalesValid,
    styleClasses: styleClassesValid,
    axes,
    axisScale
  }
}
