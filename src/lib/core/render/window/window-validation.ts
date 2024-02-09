import {LayoutBreakpoints} from "../../data/breakpoint/breakpoint";
import {RenderArgs} from "../chart/renderer";
import {ChartType} from "../../constants/types";
import {breakPointsValidation} from "../../data/breakpoint/breakpoint-validation";

export type WindowArgs = RenderArgs & {
  type: ChartType,
  bounds?: Partial<LayoutBreakpoints>
}

export type WindowValid = Required<Omit<WindowArgs, 'bounds'>> & {
  bounds: LayoutBreakpoints,
}

export function windowValidation(args: WindowArgs): WindowValid {
  return {...args,
    bounds: {
      width: breakPointsValidation(args.bounds?.width),
      height: breakPointsValidation(args.bounds?.height)
    },
  }
}
