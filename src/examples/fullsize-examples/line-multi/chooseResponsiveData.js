import {findMatchingBoundsIndex} from "../../libs/respvis/respvis.js";
import {format, select} from "../../libs/d3-7.6.0/d3.js";

const bounds = [
  {minWidth: '50rem', maxWidth: '60rem'},
  {minWidth: '40rem', maxWidth: '50rem'},
  {maxWidth: '40rem'},
]

export function chooseAxisFormat(axis, data) {
  const index = findMatchingBoundsIndex(document.documentElement, bounds)
  switch (index) {
    case 0:
    case 2:
      layoutAxisLabel(axis, 'vertical');
      break
    default:
      layoutAxisLabel(axis, 'horizontal');
      break
  }
}

function layoutAxisLabel(axis, orientation) {
  select(axis).selectAll('text').attr('orientation', orientation) //quick solution for flipping labels, apply actual styles in stylesheet
}


//------------------------------------------------------------


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
