import {RenderArgs} from "../chart/renderer";
import {validateBreakpoints, WidthAndHeightBreakpoints} from "../../data/breakpoints/breakpoints";
import {defaultWindowSettings, Revertible, WindowSettings} from "./window-settings";
import {Tooltip, TooltipUserArgs} from "respvis-tooltip";

export type WindowArgs = RenderArgs & {
  type: string,
  breakPoints?: Partial<WidthAndHeightBreakpoints>
  tooltip?: TooltipUserArgs
}

export type Window = Required<Omit<WindowArgs, 'breakPoints' | 'tooltip'>> & {
  breakpoints: WidthAndHeightBreakpoints,
  windowSettings: Revertible<WindowSettings>,
  tooltip: Tooltip
}

export function windowValidation(args: WindowArgs): Window {
  return {...args,
    breakpoints: {
      width: validateBreakpoints(args.breakPoints?.width),
      height: validateBreakpoints(args.breakPoints?.height)
    },
    windowSettings: new Revertible<WindowSettings>({ ...defaultWindowSettings }),
    tooltip: new Tooltip(args.tooltip)
  }
}
