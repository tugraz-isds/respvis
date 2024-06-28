import {LengthDimension, SVGHTMLElement} from "../../constants";
import {Breakpoints, BreakpointsUserArgs} from "../breakpoints/breakpoints";
import {Selection} from "d3";

export type LayoutBreakpointsUserArgs = Partial<Record<LengthDimension, BreakpointsUserArgs>>
export type LayoutBreakpointsArgs = LayoutBreakpointsUserArgs

export class LayoutBreakpoints {
  width: Breakpoints
  height: Breakpoints
  constructor(args?: LayoutBreakpointsArgs) {
    this.width = new Breakpoints(args?.width)
    this.height = new Breakpoints(args?.height ? {...args.height, dimension: 'height'} : {
      values: [], unit: 'rem', dimension: 'height'
    })
  }
  updateCSSVars(element: SVGHTMLElement) {
    this.width.updateLayoutCSSVars(element)
    this.height.updateLayoutCSSVars(element)
  }
}


export type WithLayoutBreakpoints = {
  breakpoints: LayoutBreakpoints
}
export type LayoutBreakpointsSelection = Selection<SVGHTMLElement, WithLayoutBreakpoints>
