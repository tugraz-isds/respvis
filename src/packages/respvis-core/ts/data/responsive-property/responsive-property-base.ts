import {
  ComponentBreakpointsScope,
  ComponentBreakpointsScopeMapping
} from "../breakpoints/component-breakpoints/component-breakpoints-scope";
import {defaultScope, LengthDimension} from "../../constants";
import {elementFromSelection} from "../../utilities";

export abstract class ResponsivePropertyBase<T> {
  readonly scope?: ComponentBreakpointsScope
  readonly dependentOn: LengthDimension
  abstract mapping: any

  protected constructor(dependentOn: LengthDimension, scope?: ComponentBreakpointsScope) {
    this.dependentOn = dependentOn;
    this.scope = scope;
  }

  getLayoutSelection(scopeMapping: ComponentBreakpointsScopeMapping) {
    const selection = this.scope ? scopeMapping[this.scope] : undefined
    return selection ? selection : scopeMapping[defaultScope]
  }

  getBreakpoints(scopeMapping: ComponentBreakpointsScopeMapping) {
    const layoutSelection = this.getLayoutSelection(scopeMapping)
    return layoutSelection.datum().breakpoints[this.dependentOn]
  }

  getFirstValidPreLayoutIndex(layoutIndex: number) {
    for (let i = layoutIndex - 1; i >= 0; i--) {
      if (this.mapping[i] !== undefined) return i
    }
    return null
  }

  getFirstValidPostLayoutIndex(exactBreakpoint: number) {
    const keys = Object.keys(this.mapping)
    for (let i = 0; i < keys.length; i++) {
      const index = parseInt(keys[i])
      if (index > exactBreakpoint) return index
    }
    return null
  }

  getFirstValidLayoutIndex() {
    const keys = Object.keys(this.mapping)
    for (let i = 0; i < keys.length; i++) {
      const index = parseInt(keys[i])
      if (!isNaN(index)) return index
    }
    return 0
  }

  getLastValidLayoutIndex(breakpointLength: number) {
    const indices = Object.keys(this.mapping)
      .map((key) => parseInt(key))
      .filter((key) => !isNaN(key) && key < breakpointLength)
    return Math.max(...indices)
  }

  getCurrentLayoutIndexFromCSS(mapping: ComponentBreakpointsScopeMapping) {
    const layoutBreakpointsS = this.getLayoutSelection(mapping)
    const element = elementFromSelection(layoutBreakpointsS)
    return this.getBreakpoints(mapping).getCurrentLayoutWidthIndexFromCSS(element)
  }

  abstract estimate(layoutIndex: number): T
}
