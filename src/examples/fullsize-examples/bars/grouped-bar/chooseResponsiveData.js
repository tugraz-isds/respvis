import {findMatchingBoundsIndex} from "../../../libs/respvis/respvis.js";
import {format} from "../../../libs/d3-7.6.0/d3.js";

const bounds = [
  {minWidth: '60rem'},
  {minWidth: '45rem'},
]

export function chooseResponsiveData(element, data) {
  const index = findMatchingBoundsIndex(element, bounds)

  switch (index) {
    case 0:
    case 1:
      data.title = "Total Remuneration 2018 to 2020";
      break
    default:
      data.title = "Total Remuneration";
      break
  }

  switch (index) {
    case 0:
    case 1:
      data.flipped = false;
      break
    default:
      data.flipped = true;
      break
  }

  switch (index) {
    case 0:
    case 1:
      data.labels.relativePositions = {x: 0.5, y: 0};
      break
    default:
      data.labels.relativePositions = {x: 1, y: 0.5};
      break
  }

  switch (index) {
    case 0:
      data.yAxis.configureAxis = (axis) => axis.tickFormat(format(','));
      break
    default:
      data.yAxis.configureAxis = (axis) => axis.tickFormat(format('.1s'));
      break
  }
}
