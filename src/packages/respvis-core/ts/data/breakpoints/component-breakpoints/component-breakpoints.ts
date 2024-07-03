import {LengthDimension, SVGHTMLElement} from "../../../constants";
import {Breakpoints, BreakpointsUserArgs} from "../breakpoints";
import {Selection} from "d3";

export type ComponentBreakpointsUserArgs = Partial<Record<LengthDimension, BreakpointsUserArgs>>
export type ComponentBreakpointsArgs = ComponentBreakpointsUserArgs

export class ComponentBreakpoints {
  width: Breakpoints
  height: Breakpoints
  constructor(args?: ComponentBreakpointsArgs) {
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
  breakpoints: ComponentBreakpoints
}
export type ComponentBreakpointsSelection = Selection<SVGHTMLElement, WithLayoutBreakpoints>
