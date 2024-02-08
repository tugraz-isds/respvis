import {LayoutBreakpoints} from "../../data/breakpoint/breakpoint";
import {RenderArgs} from "../charts/renderer";
import {ChartType} from "../../constants/types";
import {breakPointsValidation} from "../../data/breakpoint/breakpoint-validation";

export type ChartWindowArgs = RenderArgs & {
  type: ChartType,
  bounds?: Partial<LayoutBreakpoints>
}

export type ChartWindowValid = Required<Omit<ChartWindowArgs, 'bounds'>> & {
  bounds: LayoutBreakpoints,
}

export function chartWindowValidation(args: ChartWindowArgs): ChartWindowValid {
  return {...args,
    bounds: {
      width: breakPointsValidation(args.bounds?.width),
      height: breakPointsValidation(args.bounds?.height)
    },
  }
}
