import {findMatchingBoundsIndex, formatWithDecimalZero} from "../libs/respvis/respvis.js";
import {format} from "../libs/d3-7.6.0/d3.js";

function recalculateBounds(element) {
  const transformFactorWidth = Number(getComputedStyle(element).getPropertyValue('--transform-factor-width'))
  const transformFactorWidthOffset = Number(getComputedStyle(element).getPropertyValue('--transform-factor-width-offset'))
  if (isNaN(transformFactorWidth) || isNaN(transformFactorWidthOffset)) return

  const bounds = [
    {minWidth: 60 * transformFactorWidth + transformFactorWidthOffset + 'rem'},
    {minWidth: 40 * transformFactorWidth + transformFactorWidthOffset + 'rem'},
    {minWidth: 30 * transformFactorWidth + transformFactorWidthOffset + 'rem'},
    {maxWidth: 30 * transformFactorWidth + transformFactorWidthOffset + 'rem'},
  ]
  const transformSizeIndex = findMatchingBoundsIndex(element, bounds)
  console.log(transformSizeIndex)
  element.style.setProperty('--transform-index', 'wide-' + transformSizeIndex)
  // - wide-0
  // - wide-1
  // - wide-2
  return transformSizeIndex
}

export function chooseResponsiveData(element, data) {
  const index = recalculateBounds(element)
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


