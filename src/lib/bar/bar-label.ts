import {Label} from "../core/render/label/todo/series-label";

type BarLabelPosition = 'positive' | 'negative' | 'dynamic'

export type BarLabel = Label & {}

export type BarLabelsConfig = {
  offset: number
  position: BarLabelPosition
}

export type BarLabelsUserArgs = Partial<BarLabelsConfig> & {
  values: string[]
}

export type BarLabelArgValid = BarLabelsConfig & { value: string }

export class BarLabelValues implements BarLabelsConfig {
  values: string[]
  offset: number
  position: BarLabelPosition
  constructor(args: BarLabelsUserArgs) {
    this.values = args.values
    this.offset = args.offset ?? 0
    this.position = args.position ?? 'dynamic'
  }

  getArgValid(i: number) : BarLabelArgValid {
    return { value: this.values[i], offset: this.offset, position: this.position }
  }
}
