import {Label} from "respvis-core";
import {Point} from "./point";

type PointLabelPositionHorizontal = 'left' | 'center' | 'right'
type PointLabelPositionVertical = 'top' | 'center' | 'bottom'

//TODO: offset as array as in bar labels?
export type PointLabelsUserArgs = {
  offset?: number
  positionStrategyHorizontal?: PointLabelPositionHorizontal
  positionStrategyVertical?: PointLabelPositionVertical
  format?: (point: Point, label: string) => string
  values: string[]
}

export type PointLabelsData = Required<PointLabelsUserArgs>

export type PointLabelData = Omit<PointLabelsData, 'values'> & {
  value: string
}

export type PointLabel = Label & PointLabelData

export class PointLabelsDataCollection implements PointLabelsData {
  values: string[]
  offset: number
  positionStrategyHorizontal: PointLabelPositionHorizontal
  positionStrategyVertical: PointLabelPositionVertical
  format: (bar: Point, label: string) => string
  constructor(args: PointLabelsUserArgs) {
    this.values = args.values
    this.offset = args.offset ?? 0
    this.positionStrategyHorizontal = args.positionStrategyHorizontal ?? 'center'
    this.positionStrategyVertical = args.positionStrategyVertical ?? 'top'
    this.format = args.format ?? ((point, label) => label)
  }

  getLabelData(i: number) : PointLabelData {
    return { value: this.values[i], offset: this.offset,
      positionStrategyHorizontal: this.positionStrategyHorizontal, positionStrategyVertical: this.positionStrategyVertical,
      format: this.format
    }
  }
}
