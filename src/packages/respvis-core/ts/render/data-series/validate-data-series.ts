import {
  CategoriesUserArgs,
  ResponsiveValueUserArgs,
  ScaledValuesCategorical,
  SequentialColor,
  SequentialColorUserArgs,
  validateSequentialColor
} from "../../data";
import {ActiveKeyMap, SeriesKey} from "../../constants";
import {RenderArgs} from "../chart";
import {SeriesTooltipGenerator} from "respvis-tooltip";
import {DataSeries} from "./data-series";
import {mergeKeys} from "../../utilities";

export type DataSeriesUserArgs = {
  categories?: CategoriesUserArgs
  color?: SequentialColorUserArgs
  markerTooltipGenerator?: SeriesTooltipGenerator<SVGElement, any>
  flipped?: ResponsiveValueUserArgs<boolean>
}
export type DataSeriesArgs = DataSeriesUserArgs & RenderArgs & {
  key: SeriesKey
}
export type DataSeriesData = {
  categories?: ScaledValuesCategorical
  color?: SequentialColor
  key: SeriesKey
  keysActive: ActiveKeyMap
  markerTooltipGenerator?: SeriesTooltipGenerator<SVGElement, any>
  getMergedKeys: () => string[]
  getCombinedKey: (i: number) => string
}

export function validateDataSeriesArgs(args: DataSeriesArgs, series: DataSeries): DataSeriesData {
  const {key} = args
  const keysActive = {}
  keysActive[key] = true

  return {
    //TODO: pass correct parameters here
    categories: args.categories ? new ScaledValuesCategorical({
      ...args.categories, parentKey: key,
    }) : undefined,
    color: args.color ? validateSequentialColor({...args.color, renderer: args.renderer, series}) : undefined,
    key: args.key,
    keysActive,
    getMergedKeys(this: DataSeriesData) {
      if (this.categories) {
        return this.categories.categories.categoryArray.map(c =>
          mergeKeys([this.key, c.key]))
      }
      return []
    },
    getCombinedKey(this:DataSeriesData, i: number) {
      throw new Error('Method not implemented.')
    }
  }
}

function cloneDataSeriesData(args: DataSeriesData): DataSeriesData {
  return {
    ...args,
    keysActive: {...args.keysActive}
  }
}
