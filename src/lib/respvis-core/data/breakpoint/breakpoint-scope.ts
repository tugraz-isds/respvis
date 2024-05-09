import {SVGGroupingElement} from "../../constants/types";

type BreakpointScopeRequired = 'chart'
type BreakpointScopeOptional = 'self'
export type BreakpointScope = BreakpointScopeOptional | BreakpointScopeRequired
export type BreakpointScopeMapping = {
  [k in BreakpointScopeOptional]?: SVGGroupingElement
} & {
  [k in BreakpointScopeRequired]: SVGGroupingElement
}
