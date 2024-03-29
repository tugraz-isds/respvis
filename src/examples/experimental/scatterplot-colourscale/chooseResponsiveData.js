import {findMatchingBoundsIndex} from "./libs/respvis/respvis.js";
import {format} from "./libs/d3-7.6.0/d3.js";

const bounds = [
  {minWidth: '60rem'},
  {minWidth: '40rem'},
]

export function chooseResponsiveData(element, data) {
  const index = findMatchingBoundsIndex(element, bounds)
  switch (index) {
    case 0:
      data.title = 'Car Characteristics from AutoScout24 in Germany';
      break
    default:
      data.title = 'Car Characteristics';
      break
  }

  switch (index) {
    case 0:
      data.xAxis.configureAxis = (axis) => axis.tickFormat(format(','));
      break
    default:
      data.xAxis.configureAxis = (axis) => axis.tickFormat(format('.2s'));
      break
  }

  switch (index) {
    case 0:
      data.yAxis.configureAxis = (axis) => axis.tickFormat(format(','));
      break
    default:
      data.yAxis.configureAxis = (axis) => axis.tickFormat(format('.2s'));
      break
  }
}
