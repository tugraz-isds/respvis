import {Orientation, Orientations, ScaledValuesUserArgs} from "respvis-core";
import {
  AxisDomainRV,
  BaseAxisUserArgs,
  BaseAxisValid,
  ChartArgs,
  ChartUserArgs,
  ChartValid,
  chartValidation,
  validateBaseAxis,
  validateScaledValuesAxis
} from "../../../../../ts";
import {EmptySeries} from "../empty-series";

type AxisChartAxisUserArgs = BaseAxisUserArgs & {
  vals: ScaledValuesUserArgs<AxisDomainRV>
  standardOrientation?: Orientation
}

type AxisChartAxisValid = BaseAxisValid & {
  standardOrientation: Orientation
}

export type AxisChartUserArgs = ChartUserArgs & {
  axes: AxisChartAxisUserArgs[]
}

type AxisChartArgs = ChartArgs & AxisChartUserArgs

export type AxisChartValid = ChartValid & {
  axes: AxisChartAxisValid[]
}

export function axisChartValidation(args: AxisChartArgs): AxisChartValid {
  const series = new EmptySeries({key: 's-0', renderer: args.renderer})
  return {
    ...chartValidation(args),
    axes: args.axes.map((axis, index) => {
      const scaledValues = validateScaledValuesAxis(axis.vals, `a-${index}`)
      const standardOrientation = (axis.standardOrientation && Orientations.includes(axis.standardOrientation)) ?
        axis.standardOrientation : 'horizontal'
      return {
        ...validateBaseAxis({...axis, series, scaledValues, renderer: args.renderer}), standardOrientation
      }
    })
  }
}
