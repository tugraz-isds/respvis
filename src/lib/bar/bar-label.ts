import {Label} from "core/render/label/todo/series-label";
import {Bar} from "./bar";

type BarLabelPosition = 'positive' | 'negative' | 'dynamic' | 'center'

export type BarLabel = Label & {}

export type BarLabelsConfig = {
  offset: number
  position: BarLabelPosition
  format: (bar: Bar, label: string) => string
  offsetX: number[]
  offsetY: number[]
}

export type BarLabelsUserArgs = Partial<BarLabelsConfig> & {
  values: string[]
}

export type BarLabelArgValid = Omit<BarLabelsConfig, 'offsetX' | 'offsetY'> & {
  value: string
  offsetX: number
  offsetY: number
}

export class BarLabelValues implements BarLabelsConfig {
  values: string[]
  offset: number
  offsetX: number[]
  offsetY: number[]
  position: BarLabelPosition
  format: (bar: Bar, label: string) => string
  constructor(args: BarLabelsUserArgs) {
    this.values = args.values
    this.offset = args.offset ?? 0
    this.offsetX = args.offsetX ?? this.values.map(() => 0)
    this.offsetY = args.offsetY ?? this.values.map(() => 0)
    this.position = args.position ?? 'dynamic'
    this.position = args.position ?? 'dynamic'
    this.format = args.format ?? ((bar, label) => label)
  }

  getArgValid(i: number) : BarLabelArgValid {
    return { value: this.values[i], offset: this.offset, position: this.position,
      offsetX: this.offsetX[i], offsetY: this.offsetY[i], format: this.format }
  }
}
