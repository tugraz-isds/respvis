import {Bar} from "./bar";
import {Label} from "respvis-core";

type BarLabelPosition = 'positive' | 'negative' | 'dynamic' | 'center'

export type BarLabelsUserArg = {
  offset?: number
  positionStrategy?: BarLabelPosition
  format?: (bar: Bar, label: string) => string
  offsetX?: number[]
  offsetY?: number[]
  values: string[]
}

type BarLabelsData = Required<BarLabelsUserArg>

export type BarLabelData = Omit<BarLabelsData, 'offsetX' | 'offsetY' | 'values'> & {
  value: string
  offsetX: number
  offsetY: number
}

export type BarLabel = Label & BarLabelData

export class BarLabelsDataCollection implements BarLabelsData {
  values: string[]
  offset: number
  offsetX: number[]
  offsetY: number[]
  positionStrategy: BarLabelPosition
  format: (bar: Bar, label: string) => string
  constructor(args: BarLabelsUserArg) {
    this.values = args.values
    this.offset = args.offset ?? 0
    this.offsetX = args.offsetX ?? this.values.map(() => 0)
    this.offsetY = args.offsetY ?? this.values.map(() => 0)
    this.positionStrategy = args.positionStrategy ?? 'dynamic'
    this.format = args.format ?? ((bar, label) => label)
  }

  at(i: number) : BarLabelData {
    return { value: this.values[i], offset: this.offset, positionStrategy: this.positionStrategy,
      offsetX: this.offsetX[i], offsetY: this.offsetY[i], format: this.format }
  }
}
