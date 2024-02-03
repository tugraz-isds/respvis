import {ScaledValuesCategoricalUserArgs} from "./scaled-values";
import {ScaledValuesBase} from "./scaled-values-base";
import {scaleBand, ScaleBand} from "d3";
import {CategoryValid, validateCategories} from "../category";

type ScaledValuesCategoricalArgs = ScaledValuesCategoricalUserArgs & {
  parentKey: string
  parentTitle: string
}
export class ScaledValuesCategorical extends ScaledValuesBase<string> {
  tag = 'categorical' as const
  readonly values: string[]
  readonly scale: ScaleBand<string>
  readonly parentKey: string
  readonly parentTitle: string
  readonly categories: CategoryValid
  readonly keysActive: {
    [key: string]: boolean
  }

  constructor(args: ScaledValuesCategoricalArgs | ScaledValuesCategorical) {
    super()
    this.values = args.values
    this.scale = args.scale ?? scaleBand([0, 600]).domain(this.values).padding(0.1)
    this.parentKey = args.parentKey
    this.parentTitle = args.parentTitle

    this.categories = 'categories' in args ? args.categories : validateCategories(this.values, {
      values: this.values,
      title: args.parentTitle,
      parentKey: args.parentKey
    })

    this.keysActive = 'keysActive' in args ? args.keysActive : this.categories.orderKeys.reduce((prev, c) => {
      prev[`${args.parentKey}-${c}`] = true
      return prev
    }, {})
  }

  isKeyActive(key: string) { return this.keysActive[key] !== false }

  cloneFiltered() {
    const activeDomain = this.categories.values.reduce((prev, current, i) => {
      const key = `${this.parentKey}-${this.categories.valueKeys[i]}`
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
