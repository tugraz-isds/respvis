import {RenderArgs} from "../chart/renderer";
import {defaultWindowSettings, Revertible, WindowSettings} from "./window-settings";
import {Tooltip, TooltipUserArgs} from "respvis-tooltip";
import {LayoutBreakpoints} from "../../data/layout-breakpoints";
import {LayoutBreakpointsUserArgs} from "../../data/layout-breakpoints/layout-breakpoints";

export type WindowArgs = RenderArgs & {
  type: string,
  breakpoints?: LayoutBreakpointsUserArgs
  tooltip?: TooltipUserArgs
}

export type Window = Required<Omit<WindowArgs, 'breakpoints' | 'tooltip'>> & {
  breakpoints: LayoutBreakpoints,
  windowSettings: Revertible<WindowSettings>,
  tooltip: Tooltip
}

export function windowValidation(args: WindowArgs): Window {
  return {...args,
    breakpoints: new LayoutBreakpoints(args.breakpoints),
    windowSettings: new Revertible<WindowSettings>({ ...defaultWindowSettings }),
    tooltip: new Tooltip(args.tooltip)
  }
}
