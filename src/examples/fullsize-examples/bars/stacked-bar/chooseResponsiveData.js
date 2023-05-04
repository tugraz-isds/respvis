import {findMatchingBoundsIndex} from "../../../libs/respvis/respvis.js";

const bounds = [
  {minWidth: '60rem'},
  {minWidth: '40rem'},
]

export function chooseResponsiveData(element, data) {
  const index = findMatchingBoundsIndex(element, bounds)

  switch (index) {
    case 0:
    case 1:
      data.title = 'Market Share of Web Browser Platforms';
      break
    default:
      data.title = 'Web Browser Platforms';
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
      data.legend.title = 'Platform';
      break
    default:
      data.legend.title = '';
      break
  }

  switch (index) {
    case 0:
      data.xAxis.configureAxis = (axis) => axis.tickFormat((v) => v)
      break
    default:
      data.xAxis.configureAxis = (axis) => axis.tickFormat((v) => `'${v.slice(-2)}`);
      break
  }
}
