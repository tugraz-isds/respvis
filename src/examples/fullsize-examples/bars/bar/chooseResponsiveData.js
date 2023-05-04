import {findMatchingBoundsIndex} from "../../../libs/respvis/respvis.js";
import {format} from "../../../libs/d3-7.6.0/d3.js";
import cityData from '../../../data/austrian-cities.js';

const bounds = [
  {minWidth: '60rem'},
  {minWidth: '40rem'},
]
export function chooseResponsiveData(element, data) {
  const index = findMatchingBoundsIndex(element, bounds)

  switch (index) {
    case 0:
      data.labels.labels = cityData.populations.map(format(`.2s`));
      break;
    case 1:
      data.labels.labels = cityData.populations.map(format(`.3s`));
      break
    default:
      data.labels.labels = cityData.populations.map(format(`.4s`));
  }

  switch (index) {
    case 0:
    case 1:
      data.flipped = false;
      data.labels.relativePositions = {x: 0.5, y: 0}
      break
    default:
      data.flipped = true;
      data.labels.relativePositions = {x: 1, y: 0.5}
      break
  }
}
