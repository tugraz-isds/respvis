import {formatWithDecimalZero, LineChartUserArgs} from "../../../../lib";
import {format} from "d3";

export const applyMarkerTooltipsFunction = (args: LineChartUserArgs) => {
  args.series.markerTooltips = {
    tooltips: (_, {xValue, yValue}) =>
      `Year: ${xValue}<br/>Students: ${format('.2f')(yValue)}`
  }
}

export const applyYAxisFormatFunctions = (args: LineChartUserArgs) => {
  args.y.configureAxis = { ...args.y.configureAxis,
    dependentOn: 'width',
    scope: 'chart',
    mapping: {
      0: (axis) => axis.tickFormat(formatWithDecimalZero(format('.2s'))),
      2: (axis) => axis.tickFormat(formatWithDecimalZero(format(',')))
    }
  }
}

export const applyXAxisFormatFunctions = (args: LineChartUserArgs) => {
  args.x.configureAxis = (axis) => axis.tickFormat(format('.3d'))
}


export function copyFunctions<T extends object>(source: T, destination: T) {
  for (const key in source) {
    if (typeof source[key] === 'function') {
      destination[key] = source[key]
    } else if (typeof source[key] === 'object' && source[key] !== null) {
      //@ts-ignore
      destination[key] = destination[key] || {}
      //@ts-ignore
      copyFunctions(source[key], destination[key])
    }
  }
}
