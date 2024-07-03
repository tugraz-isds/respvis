import {ComponentBreakpointsSelection} from "./component-breakpoints";

type ComponentBreakpointsScopeRequired = 'chart'
type ComponentBreakpointsScopeOptional = 'self'
export type ComponentBreakpointsScope = ComponentBreakpointsScopeOptional | ComponentBreakpointsScopeRequired
export type ComponentBreakpointsScopeMapping = {
  [k in ComponentBreakpointsScopeOptional]?: ComponentBreakpointsSelection
} & {
  [k in ComponentBreakpointsScopeRequired]: ComponentBreakpointsSelection
}
