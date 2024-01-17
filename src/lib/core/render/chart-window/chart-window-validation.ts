import {LayoutBreakpoints, validateBreakpoints} from "../../data/breakpoint/breakpoint";
import {Selection} from "d3";
import {RenderArgs} from "../charts/renderer";
import {ChartType} from "../../constants/types";

export type ChartWindowSelection = Selection<HTMLDivElement, ChartWindowValid>
export type ChartWindowArgs = RenderArgs & {
  type: ChartType,
  bounds?: Partial<LayoutBreakpoints>
  //toolbar stuff comes here
  //wrapper for container queries stuff
}

export type ChartWindowValid = Required<Omit<ChartWindowArgs, 'bounds'>> & {
  bounds: LayoutBreakpoints,
}

export function validateChartWindow(args: ChartWindowArgs): ChartWindowValid {
  return {...args,
    bounds: {
      width: validateBreakpoints(args.bounds?.width),
      height: validateBreakpoints(args.bounds?.height)
    },
  }
}
