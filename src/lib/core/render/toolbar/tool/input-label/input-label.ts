import {Selection} from "d3";

export type InputLabel = {
  readonly data: InputLabelDataBase
  render: (labelS: Selection<HTMLLabelElement>) => Selection<HTMLLabelElement>
}

export type InputLabelDataBase = {
  label: string,
  type: string,
  class?: string
}
