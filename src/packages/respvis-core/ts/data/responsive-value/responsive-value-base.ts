import {BreakpointScope, BreakpointScopeMapping} from "../breakpoints/breakpoint-scope";
import {defaultScope, LengthDimension} from "../../constants";
import {elementFromSelection} from "../../utilities";

export abstract class RespValBase<T> {
  readonly scope?: BreakpointScope
  readonly dependentOn: LengthDimension
  abstract mapping: any

  protected constructor(dependentOn: LengthDimension, scope?: BreakpointScope) {
    this.dependentOn = dependentOn;
    this.scope = scope;
  }

  getLayoutSelection(scopeMapping: BreakpointScopeMapping) {
    const selection = this.scope ? scopeMapping[this.scope] : undefined
    return selection ? selection : scopeMapping[defaultScope]
  }

  getBreakpoints(scopeMapping: BreakpointScopeMapping) {
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
    return null
  }

  getLastValidLayoutIndex() {
    const indices = Object.keys(this.mapping)
      .map((key) => parseInt(key))
      .filter((key) => !isNaN(key))
    return Math.max(...indices)
  }

  getCurrentLayoutIndexFromCSS(mapping: BreakpointScopeMapping) {
    const layoutBreakpointsS = this.getLayoutSelection(mapping)
    const element = elementFromSelection(layoutBreakpointsS)
    return this.getBreakpoints(mapping).getCurrentLayoutWidthIndexFromCSS(element)
  }

  abstract estimate(layoutIndex: number): T
}
