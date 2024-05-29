import {
  AxisDomainRV,
  BaseAxis,
  BaseAxisUserArgs,
  ChartData,
  ChartDataArgs,
  ChartDataUserArgs,
  Orientation,
  Orientations,
  ScaledValuesUserArgs,
  validateBaseAxis,
  validateChart,
  validateScaledValuesAxis
} from "../../../../../packages";
import {EmptySeries} from "../empty-series";

type AxisChartAxisUserArgs = BaseAxisUserArgs & {
  vals: ScaledValuesUserArgs<AxisDomainRV>
  standardOrientation?: Orientation
}

type AxisChartAxisValid = BaseAxis & {
  standardOrientation: Orientation
}

export type AxisChartUserArgs = ChartDataUserArgs & {
  axes: AxisChartAxisUserArgs[]
}

type AxisChartArgs = ChartDataArgs & AxisChartUserArgs

export type AxisChartValid = ChartData & {
  axes: AxisChartAxisValid[]
}

export function axisChartValidation(args: AxisChartArgs): AxisChartValid {
  const series = new EmptySeries({key: 's-0', renderer: args.renderer})
  return {
    ...validateChart(args),
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
