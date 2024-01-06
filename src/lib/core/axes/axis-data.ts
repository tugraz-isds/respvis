import {Axis as D3Axis, AxisDomain, AxisScale} from 'd3';
import {LengthDimensionBounds, TickOrientation} from "../utilities/resizing/matchBounds";
import {ConfigBoundable} from "../utilities/resizing/boundable";
import {validateScale} from "../utilities/scale";
import {validateCategories} from "../categories";
import {validateBounds} from "../utilities/resizing/bounds";

export type AxisArgs = {
  values: number[], // TODO: add strings/dates, also for y
  scale?: AxisScale<AxisDomain>,
  categories?: string[]
  bounds?: Partial<LengthDimensionBounds>
  title?: ConfigBoundable<string>,
  subTitle?: ConfigBoundable<string>,
  configureAxis?: ConfigBoundable<ConfigureAxisFn>,
  tickOrientation?: TickOrientation
}

export type AxisValid = Required<Omit<AxisArgs, 'tickOrientation' | 'bounds'>> & {
  tickOrientation?: TickOrientation,
  bounds: LengthDimensionBounds
}

export interface ConfigureAxisFn {
  (axis: D3Axis<AxisDomain>): void;
}

export function axisData(data: AxisArgs): AxisValid {
  //TODO: find correct types for scale and d3 scale
  //TODO: sort bounds
  return {
    values: data.values,
    scale: validateScale(data.values, data.scale).range([0, 600]),
    categories: validateCategories(data.values, data.categories),
    title: data.title || '',
    subTitle: data.subTitle || '',
    configureAxis: data.configureAxis || (() => {}),
    tickOrientation: data.tickOrientation,
    bounds: {
      width: validateBounds(data.bounds?.width),
      height: validateBounds(data.bounds?.height)
    }
  }
}

export function syncAxes(...axes: AxisValid[]) {
  const lowestLength = axes.reduce((prev, current) =>
    current.values.length < prev ? current.values.length : prev, Number.MAX_VALUE)
  return axes.map(axis => {
    return {...axis,
      values: axis.values.slice(0, lowestLength),
      categories: axis.categories.slice(0, lowestLength),
    }
  })
}

