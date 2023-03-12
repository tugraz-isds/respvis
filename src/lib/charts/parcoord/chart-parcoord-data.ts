import {IWindowChartParcoordArgs} from "./IWindowChartParcoordArgs";
import {IChartParcoordData} from "./IChartParcoordData";
import {axisData, calcDefaultScale} from "../../core";

export function parcoordData(data: IWindowChartParcoordArgs): IChartParcoordData {
  const {scales, styleClasses, legend, dimensions} = data
  const scalesValid = scales ? scales : dimensions.map(dimension => calcDefaultScale(dimension))
  const styleClassesValid = styleClasses ? styleClasses : dimensions[0].map((dimensions, index) => `categorical-${index}`)
  const axes = scalesValid.map((scale, index) => {
    return axisData({scale}) //TODO: correct data here
  })

  return {
    dimensions,
    scales: scalesValid,
    styleClasses: styleClassesValid,
    axes
  }
}
