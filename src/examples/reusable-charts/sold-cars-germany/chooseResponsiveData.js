import {findMatchingBoundsIndex, formatWithDecimalZero} from "../../libs/respvis/respvis.js";
import {format} from "../../libs/d3-7.6.0/d3.js";

const bounds = [
  {minWidth: '60rem'},
  {minWidth: '40rem'},
]

export function chooseResponsiveData(element, data) {
  const index = findMatchingBoundsIndex(element, bounds)
  switch (index) {
    case 0:
      data.title = 'Average Opening Price of Google Stock';
      break
    default:
      data.title = 'Google Stock';
      break
  }

  switch (index) {
    case 0:
    case 1:
      data.yAxis.configureAxis = (axis) => axis.tickFormat(formatWithDecimalZero(format(',')));
      break
    default:
      data.yAxis.configureAxis = (axis) => axis.tickFormat(formatWithDecimalZero(format('.2s')));
      break
  }

  switch (index) {
    case 0:
    case 1:
      data.legend.title = 'Legend';
      break
    default:
      data.legend.title = '';
      break
  }

  switch (index) {
    case 0:
      data.pointSeries[0].radiuses.scale.range([5, 20])
      data.maxRadius = 20
      break
    case 1:
      data.pointSeries[0].radiuses.scale.range([4, 16])
      data.maxRadius = 16
      break
    default:
      data.pointSeries[0].radiuses.scale.range([3, 12])
      data.maxRadius = 12
      break
  }
}
