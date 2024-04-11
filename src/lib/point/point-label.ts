import {Label} from "../core/render/label/todo/series-label";
import {Point} from "./point-series/point";

type PointLabelPositionHorizontal = 'left' | 'center' | 'right'
type PointLabelPositionVertical = 'top' | 'center' | 'bottom'

export type PointLabel = Label & {}

export type PointLabelsConfig = {
  offset: number
  positionHorizontal: PointLabelPositionHorizontal
  positionVertical: PointLabelPositionVertical
  format: (point: Point, label: string) => string
}

export type PointLabelsUserArgs = Partial<PointLabelsConfig> & {
  values: string[]
}

export type PointLabelArgValid = PointLabelsConfig & {
  value: string
}

export class PointLabelValues implements PointLabelsConfig {
  values: string[]
  offset: number
  positionHorizontal: PointLabelPositionHorizontal
  positionVertical: PointLabelPositionVertical
  format: (bar: Point, label: string) => string
  constructor(args: PointLabelsUserArgs) {
    this.values = args.values
    this.offset = args.offset ?? 0
    this.positionHorizontal = args.positionHorizontal ?? 'center'
    this.positionVertical = args.positionVertical ?? 'top'
    this.format = args.format ?? ((point, label) => label)
  }

  getArgValid(i: number) : PointLabelArgValid {
    return { value: this.values[i], offset: this.offset,
      positionHorizontal: this.positionHorizontal, positionVertical: this.positionVertical,
      format: this.format
    }
  }
}
