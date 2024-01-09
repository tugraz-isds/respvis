import {LengthDimensionBounds, validateBounds} from "../utilities/resizing/bounds";
import {Selection} from "d3";

export type ChartWindowSelection = Selection<HTMLDivElement, ChartWindowValid>
export type ChartWindowArgs = {
  type: 'point' | 'bar' | 'line',
  bounds?: Partial<LengthDimensionBounds>
  //toolbar stuff comes here
  //wrapper for container queries stuff
}

export type ChartWindowValid = Required<Omit<ChartWindowArgs, 'bounds'>> & {
  bounds: LengthDimensionBounds,
}

export function validateChartWindow(args: ChartWindowArgs): ChartWindowValid {
  return {...args,
    bounds: {
      width: validateBounds(args.bounds?.width),
      height: validateBounds(args.bounds?.height)
    },
  }
}
