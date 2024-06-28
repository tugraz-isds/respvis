import {
  BaseAxis,
  BaseAxisUserArgs,
  ChartData,
  ChartDataArgs,
  ChartDataUserArgs,
  Orientation,
  Orientations,
  RespValByValueUserArgs,
  ScaledValuesSpatialDomain,
  ScaledValuesSpatialUserArgs,
  validateBaseAxis,
  validateChart,
  validateScaledValuesSpatial
} from "../../../../../packages";
import {EmptySeries} from "../empty-series";

export type AxisChartAxisUserArgs = BaseAxisUserArgs & {
  vals: ScaledValuesSpatialUserArgs<ScaledValuesSpatialDomain>
  standardOrientation?: Orientation
}

type AxisChartAxisValid = BaseAxis & {
  standardOrientation: Orientation
}

export type AxisChartUserArgs = ChartDataUserArgs & {
  axes: AxisChartAxisUserArgs[]
  flipped?: RespValByValueUserArgs<boolean>
}

type AxisChartArgs = ChartDataArgs & AxisChartUserArgs

export type AxisChartValid = ChartData & {
  axes: AxisChartAxisValid[],
  series: EmptySeries
}

export function validateAxisChart(args: AxisChartArgs): AxisChartValid {
  const series = new EmptySeries({key: 's-0', renderer: args.renderer, flipped: args.flipped})
  return {
    ...validateChart(args),
    series,
    axes: args.axes.map((axis, index) => {
      const scaledValues = validateScaledValuesSpatial(axis.vals, `a-${index}`)
      const standardOrientation = (axis.standardOrientation && Orientations.includes(axis.standardOrientation)) ?
        axis.standardOrientation : 'horizontal'
      return {
        ...validateBaseAxis({...axis, series, scaledValues, renderer: args.renderer}), standardOrientation
      }
    })
  }
}
