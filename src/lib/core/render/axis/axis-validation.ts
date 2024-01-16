import {Axis as D3Axis, AxisDomain, AxisScale} from 'd3';
import {TickOrientation} from "../../data/breakpoint/matchBounds";
import {ResponsiveValueOptional} from "../../data/breakpoint/responsive-value";
import {validateScale} from "../../utilities/scale";
import {defaultCategory, validateCategories} from "../../data/category";
import {LayoutBreakpoints, validateBreakpoints} from "../../data/breakpoint/breakpoint";
import {RenderArgs} from "../charts/renderer";

export type AxisUserArgs = {
  values: number[], // TODO: add strings/dates, also for y
  scale?: AxisScale<AxisDomain>,
  categories?: string[],
  categoriesTitle?: ResponsiveValueOptional<string>
  bounds?: Partial<LayoutBreakpoints>
  title?: ResponsiveValueOptional<string>,
  subTitle?: ResponsiveValueOptional<string>,
  configureAxis?: ResponsiveValueOptional<ConfigureAxisFn>,
  tickOrientation?: TickOrientation
}

export type AxisArgs = AxisUserArgs & RenderArgs

export type AxisValid = Required<Omit<AxisArgs, 'tickOrientation' | 'bounds'>> & {
  tickOrientation?: TickOrientation,
  bounds: LayoutBreakpoints
  categoryOrder: Record<string, number>
}

export interface ConfigureAxisFn {
  (axis: D3Axis<AxisDomain>): void;
}

export function axisValidation(data: AxisArgs): AxisValid {
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
    renderer: data.renderer,
    values: data.values,
    scale: validateScale(data.values, data.scale).range([0, 600]),
    categories: validateCategories(data.values, data.categories),
    categoriesTitle: data.categoriesTitle || 'Categories',
    categoryOrder,
    title: data.title || '',
    subTitle: data.subTitle || '',
    configureAxis: data.configureAxis || (() => {
    }),
    tickOrientation: data.tickOrientation,
    bounds: {
      width: validateBreakpoints(data.bounds?.width),
      height: validateBreakpoints(data.bounds?.height)
    }
  }
}

export function syncAxes(...axes: AxisValid[]) {
  const lowestLength = axes.reduce((prev, current) =>
    current.values.length < prev ? current.values.length : prev, Number.MAX_VALUE)
  const sharedCategoryAxis = axes.find(axis => axis.categories[0] !== defaultCategory)
  const sharedCategory = sharedCategoryAxis?.categories.slice(0, lowestLength)
  const sharedCategoryOrder = sharedCategoryAxis?.categoryOrder
  const sharedCategoryTitle = sharedCategoryAxis?.categoriesTitle
  return axes.map(axis => {
    return {
      ...axis,
      values: axis.values.slice(0, lowestLength),
      categories: sharedCategory ? sharedCategory : axis.categories.slice(0, lowestLength),
      categoryOrder: sharedCategoryOrder ? sharedCategoryOrder : axis.categoryOrder,
      categoriesTitle: sharedCategoryTitle ? sharedCategoryTitle : axis.categoriesTitle
    }
  })
}

