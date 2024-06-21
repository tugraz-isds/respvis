import {LayoutBreakpointsSelection} from "../layout-breakpoints/layout-breakpoints";

type BreakpointScopeRequired = 'chart'
type BreakpointScopeOptional = 'self'
export type BreakpointScope = BreakpointScopeOptional | BreakpointScopeRequired
export type BreakpointScopeMapping = {
  [k in BreakpointScopeOptional]?: LayoutBreakpointsSelection
} & {
  [k in BreakpointScopeRequired]: LayoutBreakpointsSelection
}
