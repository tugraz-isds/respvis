import {ScaledValuesCategoricalUserArgs} from "./scaled-values";
import {ScaledValuesBase} from "./scaled-values-base";
import {scaleBand, ScaleBand} from "d3";
import {CategoryValid, validateCategories} from "../category";
import {ActiveKeyMap} from "../../constants/types";
import {RespValOptional} from "../responsive-value/responsive-value";

type ScaledValuesCategoricalArgs = ScaledValuesCategoricalUserArgs & {
  parentKey: string
  title: RespValOptional<string>
}
export class ScaledValuesCategorical extends ScaledValuesBase<string> {
  tag = 'categorical' as const
  readonly values: string[]
  readonly scale: ScaleBand<string>
  readonly parentKey: string
  readonly title: RespValOptional<string>
  readonly categories: CategoryValid
  readonly keysActive: ActiveKeyMap

  constructor(args: ScaledValuesCategoricalArgs | ScaledValuesCategorical) {
    super()
    this.values = args.values
    this.scale = args.scale ?? scaleBand([0, 600]).domain(this.values).padding(0.1)
    this.parentKey = args.parentKey
    this.title = args.title

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

  isKeyActiveByKey(key: string) {
    return this.keysActive[key] !== false
  }

  isKeyActiveByIndex(i: number) {
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

  cloneFiltered() {
    const activeDomain = this.categories.values.reduce((prev, current, i) => {
      const key = `${this.parentKey}-${this.categories.keyValues[i]}`
      return this.keysActive[key] ? [...prev, current] : prev
    }, [])
    const clone = this.clone()
    clone.scale.domain(activeDomain)
    return clone
  }

  clone(): ScaledValuesCategorical {
    return new ScaledValuesCategorical({...this, scale: this.scale.copy()})
  }
}
