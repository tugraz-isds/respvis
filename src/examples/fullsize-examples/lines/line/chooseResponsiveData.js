import {findMatchingBoundsIndex} from "../../../libs/respvis/respvis.js";
import {format} from "../../../libs/d3-7.6.0/d3.js";

const bounds = [
  {minWidth: '80rem'},
  {minWidth: '60rem'},
  {minWidth: '40rem'},
]

export function chooseResponsiveData(element, data) {
  const index = findMatchingBoundsIndex(element, bounds)
  switch (index) {
    case 0:
      data.title = 'Students Registered at TU Graz';
      data.subtitle = '';
      break
    case 1:
    case 2:
      data.title = 'Registered Students';
      data.subtitle = 'TU Graz';
      break;
    default:
      data.title = 'Students at TU Graz';
      data.subtitle = '';
      break
  }

  switch (index) {
    case 0:
    case 1:
      data.xAxis.configureAxis = (axis) => axis.tickFormat((v) => v);
      break
    default:
      data.xAxis.configureAxis = (axis) => axis.tickFormat((v) => `'${v.slice(-2)}`);
      break
  }

  switch (index) {
    case 0:
    case 1:
      data.yAxis.configureAxis = (axis) => axis.tickFormat(format(','));
      break
    default:
      data.yAxis.configureAxis = (axis) => axis.tickFormat(format('.2s'));
      break
  }
}
