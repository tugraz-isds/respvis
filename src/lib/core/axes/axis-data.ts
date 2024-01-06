import {Axis as D3Axis, AxisDomain, AxisScale, schemeGnBu} from 'd3';
import {LengthDimensionBounds, TickOrientation} from "../utilities/resizing/matchBounds";
import {ConfigBoundable} from "../utilities/resizing/boundable";
import {validateScale} from "../utilities/scale";
import {defaultCategory, validateCategories} from "../categories";
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
  categoryOrder: Record<string, number>
}

export interface ConfigureAxisFn {
  (axis: D3Axis<AxisDomain>): void;
}

export function axisData(data: AxisArgs): AxisValid {
  //TODO: find correct types for scale and d3 scale
  //TODO: sort bounds
  const categories = validateCategories(data.values, data.categories)
  const categoryOrder1 = categories.reduce<string[]>(
    (prev, current) => prev.includes(current) ? prev : [...prev, current], [])
    const categoryOrder = categoryOrder1.reduce((prev, current, index) => {
      prev[current] = index
      return prev
    }, {})

  return {
    values: data.values,
    scale: validateScale(data.values, data.scale).range([0, 600]),
    categories: validateCategories(data.values, data.categories),
    categoryOrder,
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
  const sharedCategoryAxis = axes.find(axis => axis.categories[0] !== defaultCategory)
  const sharedCategory = sharedCategoryAxis?.categories.slice(0, lowestLength)
  const sharedCategoryOrder = sharedCategoryAxis?.categoryOrder
  return axes.map(axis => {
    return {...axis,
      values: axis.values.slice(0, lowestLength),
      categories: sharedCategory ? sharedCategory : axis.categories.slice(0, lowestLength),
      categoryOrder: sharedCategoryOrder ? sharedCategoryOrder: axis.categoryOrder
    }
  })
}

