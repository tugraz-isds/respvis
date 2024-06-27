import {ScaledValuesSpatialBase, ScaledValuesSpatialBaseArgs} from "./scaled-values-spatial-base";
import {scaleBand, ScaleBand, ZoomTransform} from "d3";
import {Categories, validateCategories} from "../../categories";
import {ActiveKeyMap, AxisType} from "../../../constants/types";
import {RespVal, RespValUserArgs, validateRespVal} from "../../responsive-value/responsive-value";

export type ScaledValuesCategoricalUserArgs = {
  values: string[],
  scale?: ScaleBand<string>
}

type ScaledValuesCategoricalArgs = ScaledValuesCategoricalUserArgs & ScaledValuesSpatialBaseArgs & {
  title: RespValUserArgs<string>
}

export class ScaledValuesCategorical extends ScaledValuesSpatialBase<string> {
  tag = 'categorical' as const
  readonly values: string[]
  readonly scale: ScaleBand<string>
  readonly flippedScale: ScaleBand<string>
  readonly title: RespVal<string>
  readonly categories: Categories
  readonly keysActive: ActiveKeyMap

  constructor(args: ScaledValuesCategoricalArgs | ScaledValuesCategorical) {
    super(args)
    this.values = args.values
    this.scale = args.scale ?? scaleBand([0, 600]).domain(this.values).padding(0.1)
    this.flippedScale = this.scale.copy()
    this.title = 'tag' in args ? args.title : validateRespVal(args.title)

    //TODO: this is no real alignment validation. Fix this!
    this.categories = 'categories' in args ? args.categories : validateCategories(this.values, {
      values: this.values,
      title: args.title,
      parentKey: args.parentKey
    })

    this.keysActive = 'keysActive' in args ? args.keysActive : this.categories.keyOrder.reduce((prev, c) => {
      prev[`${args.parentKey}-${c}`] = true
      return prev
    }, {})
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
    return this.keysActive[key] !== false
  }

  isValueActive(i: number) {
    return this.isKeyActiveByKey(this.getCombinedKey(i))
  }

  setKeyActiveIfDefined(key: string, value: boolean) {
    if (this.keysActive[key] !== undefined) this.keysActive[key] = value
  }

  getCombinedKey(i: number) {
    return this.parentKey + '-' + this.categories.keyValues[i]
  }

  getCategoryData(i: number) {
    const categoryKey = this.categories.keyValues[i]
    const parentKey = this.parentKey
    const combinedKey = parentKey + '-' + categoryKey
    const styleClass = this.categories.styleClassOrder[i]
    return {categoryKey, parentKey, combinedKey, styleClass}
  }

  cloneZoomed(transform: ZoomTransform, axisType: AxisType) {
    return this.clone()
  }

  cloneFiltered() {
    const activeDomain = this.categories.values.reduce((prev, current, i) => {
      const key = `${this.parentKey}-${this.categories.keyValues[i]}`
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
