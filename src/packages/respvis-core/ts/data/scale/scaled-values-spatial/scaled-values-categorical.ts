import {ScaledValuesSpatialBase, ScaledValuesSpatialBaseArgs} from "./scaled-values-spatial-base";
import {scaleBand, ScaleBand, ZoomTransform} from "d3";
import {Categories, CategoriesUserArgs, isCategoryUserArgs} from "../../categories";
import {AxisType, KeyPrefix} from "../../../constants/types";
import {ResponsiveValueOptional} from "../../responsive-property";
import {Key} from "../../../utilities";

export type ScaledValuesCategoricalUserArgs = CategoriesUserArgs & {
  scale?: ScaleBand<string>,
}

export function isScaledValuesCategoricalUserArgs(args: any): args is ScaledValuesCategoricalUserArgs {
  return isCategoryUserArgs(args.values)
}

export type ScaledValuesCategoricalArgs = Pick<ScaledValuesCategoricalUserArgs, 'values' | 'scale'> &
  ScaledValuesSpatialBaseArgs & {
  categories: Categories
}

export class ScaledValuesCategorical extends ScaledValuesSpatialBase<string> {
  tag = 'categorical' as const
  readonly values: string[]
  readonly scale: ScaleBand<string>
  readonly flippedScale: ScaleBand<string>
  readonly title: ResponsiveValueOptional<string>
  readonly categories: Categories

  constructor(args: ScaledValuesCategoricalArgs | ScaledValuesCategorical) {
    super(args)
    this.values = args.values
    this.scale = args.scale ?? scaleBand([0, 600]).domain(this.values).padding(0.1)
    this.flippedScale = this.scale.copy()
    this.categories = args.categories
    this.title = args.categories.title
  }

  getOrder(i: number) {
    return this.categories.categoryMap[this.values[i]].order
  }

  getStyleClass(i: number) {
    return this.categories.categoryMap[this.values[i]].styleClass
  }

  getScaledValueStart(i: number) {
    return valByIndexFormula[this.orientation].start(i, this)
  }

  getScaledValue(i: number) {
    return valByIndexFormula[this.orientation].middle(i, this)
  }

  getScaledValueEnd(i: number) {
    return valByIndexFormula[this.orientation].end(i, this)
  }

  isKeyActiveByKey(key: string) {
    // noinspection PointlessBooleanExpressionJS
    return this.categories.categoryMap[key].key.active
  }

  isValueActive(i: number) {
    return this.isKeyActiveByKey(this.getCombinedKey(i))
  }

  setKeyActiveIfDefined(key: string, value: boolean) {
    if (this.keysActive[key] !== undefined) this.keysActive[key] = value
  }

  getKeys(i: number): Key<KeyPrefix>[] {
    const rawCategory = this.values[i]
    const category = this.categories.categoryMap[rawCategory]
    const categoryKey = category.key
    const categoriesKey = this.categories.key
    return [categoryKey, categoriesKey]
  }

  getCombinedKey(i: number) {
    const category = this.values[i]
    return this.parentKey + '-' + this.categories.categoryMap[category].key
  }

  getCategoryData(i: number) {
    const rawCategory = this.values[i]
    const category = this.categories.categoryMap[rawCategory]
    const categoryKey = category.key
    const categoriesKey = this.categories.key
    // const combinedKey = parentKey + '-' + categoryKey
    const styleClass = category.styleClass
    return {categoryKey, categoriesKey, styleClass}
  }

  cloneZoomed(transform: ZoomTransform, axisType: AxisType) {
    return this.clone()
  }

  cloneFiltered() {
    const activeDomain = this.values.reduce((prev, current) => {
      const key = `${this.parentKey}-${this.categories.categoryMap[current].key}`
      return this.keysActive[key] ? [...prev, current] : prev
    }, [])
    const clone = this.clone()
    clone.scale.domain(activeDomain)
    return clone
  }

  atScreenPosition(value: number) {
    const activeValues = this.cloneFiltered()
    const domain = activeValues.scale.domain()
    return domain.find(category => {
      const lower = activeValues.scale(category)!
      const upper = lower + activeValues.scale.bandwidth()
      return value > lower && value < upper
    }) ?? ''
  }

  clone(): ScaledValuesCategorical {
    return new ScaledValuesCategorical({...this, scale: this.scale.copy()})
  }
}

const valByIndexFormulaCategoricalHorizontal = {
  start: (index: number, scaledValues: ScaledValuesCategorical) => {
    return scaledValues.scale(scaledValues.values[index])!
  },
  middle: (index: number, scaledValues: ScaledValuesCategorical) => {
    return scaledValues.scale(scaledValues.values[index])! + scaledValues.scale.bandwidth() / 2
  },
  end: (index: number, scaledValues: ScaledValuesCategorical) => {
    return scaledValues.scale(scaledValues.values[index])! + scaledValues.scale.bandwidth()
  }
} as const

const valByIndexFormulaCategoricalVertical = {
  start: (index: number, scaledValues: ScaledValuesCategorical) => {
    return scaledValues.scale(scaledValues.values[index])! - scaledValues.scale.bandwidth()
  },
  middle: (index: number, scaledValues: ScaledValuesCategorical) => {
    return scaledValues.scale(scaledValues.values[index])! - scaledValues.scale.bandwidth() / 2
  },
  end: (index: number, scaledValues: ScaledValuesCategorical) => {
    return scaledValues.scale(scaledValues.values[index])!
  }
} as const

const valByIndexFormula = {
  horizontal: valByIndexFormulaCategoricalHorizontal,
  vertical: valByIndexFormulaCategoricalVertical
} as const
