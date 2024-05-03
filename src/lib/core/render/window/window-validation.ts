import {LayoutBreakpoints} from "../../data/breakpoint/breakpoint";
import {RenderArgs} from "../chart/renderer";
import {breakPointsValidation} from "../../data/breakpoint/breakpoint-validation";
import {defaultWindowSettings, WindowSettings} from "./window-settings";

export type WindowArgs = RenderArgs & {
  type: string,
  breakPoints?: Partial<LayoutBreakpoints>
}

export type WindowValid = Required<Omit<WindowArgs, 'breakPoints'>> & {
  breakPoints: LayoutBreakpoints,
  windowSettings: WindowSettings
}

export function windowValidation(args: WindowArgs): WindowValid {
  return {...args,
    breakPoints: {
      width: breakPointsValidation(args.breakPoints?.width),
      height: breakPointsValidation(args.breakPoints?.height)
    },
    windowSettings: { ...defaultWindowSettings }
  }
}
