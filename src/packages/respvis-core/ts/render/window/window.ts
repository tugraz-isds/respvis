import {RenderArgs} from "../chart/renderer";
import {defaultWindowSettings, Revertible, WindowSettings} from "./window-settings";
import {Tooltip, TooltipUserArgs} from "respvis-tooltip";
import {ComponentBreakpoints} from "../../data/breakpoints/component-breakpoints";
import {ComponentBreakpointsUserArgs} from "../../data/breakpoints/component-breakpoints/component-breakpoints";

export type WindowArgs = RenderArgs & {
  type: string,
  breakpoints?: ComponentBreakpointsUserArgs
  tooltip?: TooltipUserArgs
}

export type Window = Required<Omit<WindowArgs, 'breakpoints' | 'tooltip'>> & {
  breakpoints: ComponentBreakpoints,
  windowSettings: Revertible<WindowSettings>,
  tooltip: Tooltip
}

export function windowValidation(args: WindowArgs): Window {
  return {...args,
    breakpoints: new ComponentBreakpoints(args.breakpoints),
    windowSettings: new Revertible<WindowSettings>({ ...defaultWindowSettings }),
    tooltip: new Tooltip(args.tooltip)
  }
}
