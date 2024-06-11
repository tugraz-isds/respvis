import {RenderArgs} from "../chart/renderer";
import {validateBreakpoints, WidthAndHeightBreakpoints} from "../../data/breakpoints/breakpoints";
import {defaultWindowSettings, WindowSettings} from "./window-settings";
import {Tooltip, TooltipUserArgs} from "respvis-tooltip";

export type WindowArgs = RenderArgs & {
  type: string,
  breakPoints?: Partial<WidthAndHeightBreakpoints>
  tooltip?: TooltipUserArgs
}

export type Window = Required<Omit<WindowArgs, 'breakPoints' | 'tooltip'>> & {
  breakpoints: WidthAndHeightBreakpoints,
  windowSettings: WindowSettings
  tooltip: Tooltip
}

export function windowValidation(args: WindowArgs): Window {
  return {...args,
    breakpoints: {
      width: validateBreakpoints(args.breakPoints?.width),
      height: validateBreakpoints(args.breakPoints?.height)
    },
    windowSettings: { ...defaultWindowSettings },
    tooltip: new Tooltip(args.tooltip)
  }
}
