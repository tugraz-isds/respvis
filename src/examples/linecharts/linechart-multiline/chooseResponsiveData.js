import {findMatchingBoundsIndex} from "./libs/respvis/respvis.js";
import {format} from "./libs/d3-7.6.0/d3.js";

const boundsChart = [
  {minWidth: '50rem'},
  {minWidth: '30rem'},
]

export function chooseResponsiveData(element, data) {
  const index = findMatchingBoundsIndex(document.documentElement, boundsChart)

  switch (index) {
    case 0:
      data.title = 'Electric Power Consumption (kWh per Capita)'
      break
    case 1:
      data.title = 'Power Consumption (kWh)'
      break
    default:
      data.title = 'Power (kWh)'
  }

  switch (index) {
    case 0:
      data.yAxis.configureAxis = (axis) => axis.tickFormat(format(','));
      break
    default:
      data.yAxis.configureAxis = (axis) => axis.tickFormat(format('.2s'));
      break
  }

  switch (index) {
    case 0:
      data.legend.title = 'Legend'
      break
    default:
      data.legend.title = ''
  }
}
