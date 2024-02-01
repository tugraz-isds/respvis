import {SeriesValid} from "./series";
import {getSeriesItemAxisData} from "./series-item-axis";

export type SeriesItemCategory = {
  styleClass: string,
  key: string,
  seriesCategory: string,
  label: string,
  axisCategoryKeyX: string,
  axisCategoryKeyY: string,
  styleClassX: string,
  styleClassY: string
}

type Props = Pick<SeriesValid, 'categories' | 'key' | 'labelCallback' | 'x' | 'y'> & {
  index: number
  flipped: boolean
}

export function getSeriesItemCategoryData(props: Props) : SeriesItemCategory {
  const {
    categories, key: seriesKey, labelCallback,
    x, y, index, flipped
  } = props
  const {axisCategoryKey: axisCategoryKeyX, styleClass: styleClassX} = getSeriesItemAxisData(x, index)
  const {axisCategoryKey: axisCategoryKeyY, styleClass: styleClassY} = getSeriesItemAxisData(y, index)
  let firstAxisKey = flipped ? axisCategoryKeyY : axisCategoryKeyX
  firstAxisKey = firstAxisKey ? ' ' + firstAxisKey : ''
  let secondAxisKey = flipped ? axisCategoryKeyX : axisCategoryKeyY
  secondAxisKey = secondAxisKey ? ' ' + secondAxisKey : ''

  const category = categories?.values[index]
  const categoryKey = categories?.valueKeys[index]
  const seriesCategory = `${seriesKey}${categoryKey ? ` ${categoryKey}` : ''}`
  const key = `${seriesCategory}${firstAxisKey}${secondAxisKey} i-${index}`
  const styleClassCategory = (categories && category) ? `categorical-${categories.orderMap[category]}` : 'categorical-0'
  const styleClass = `${styleClassCategory}` //TODO: What about more specific category attributes? //${styleClassX} ${styleClassY}
  const label = labelCallback(category ?? '')
  return {styleClass, key, seriesCategory, label, axisCategoryKeyX, axisCategoryKeyY, styleClassX, styleClassY}
}
