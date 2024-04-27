import {LayoutBreakpoints} from "../../data/breakpoint/breakpoint";
import {RenderArgs} from "../chart/renderer";
import {breakPointsValidation} from "../../data/breakpoint/breakpoint-validation";
import {defaultWindowSettings, WindowSettings} from "./window-settings";

export type WindowArgs = RenderArgs & {
  type: string,
  bounds?: Partial<LayoutBreakpoints>
}

export type WindowValid = Required<Omit<WindowArgs, 'bounds'>> & {
  bounds: LayoutBreakpoints,
  windowSettings: WindowSettings
}

export function windowValidation(args: WindowArgs): WindowValid {
  return {...args,
    bounds: {
      width: breakPointsValidation(args.bounds?.width),
      height: breakPointsValidation(args.bounds?.height)
    },
    windowSettings: { ...defaultWindowSettings }
  }
}
