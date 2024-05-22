import {RenderArgs} from "../chart/renderer";
import {validateBreakpoints, WidthAndHeightBreakpoints} from "respvis-core/data/breakpoints/breakpoints";
import {defaultWindowSettings, WindowSettings} from "./window-settings";

export type WindowArgs = RenderArgs & {
  type: string,
  breakPoints?: Partial<WidthAndHeightBreakpoints>
}

export type Window = Required<Omit<WindowArgs, 'breakPoints'>> & {
  breakpoints: WidthAndHeightBreakpoints,
  windowSettings: WindowSettings
}

export function windowValidation(args: WindowArgs): Window {
  return {...args,
    breakpoints: {
      width: validateBreakpoints(args.breakPoints?.width),
      height: validateBreakpoints(args.breakPoints?.height)
    },
    windowSettings: { ...defaultWindowSettings }
  }
}
