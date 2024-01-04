import {LengthDimension, SVGHTMLElement} from "./types";
import {getBoundStateFromCSS, LenghtDimensionIndices} from "./bounds";

type BoundScopeRequired = 'chart'
type BoundScopeOptional = 'self'
export type BoundScope = BoundScopeOptional | BoundScopeRequired
export type BoundScopeElementMapping = {
  [k in BoundScopeOptional]?: SVGHTMLElement
} & {
  [k in BoundScopeRequired]: SVGHTMLElement
}

type ConfigTupleBoundable<T> = {
  tuples: [index: number, value: T][]
  dependentOn: LengthDimension,
  scope?: BoundScope
}
export type ConfigBoundable<T> = ConfigTupleBoundable<T> | T

export function isConfigTupleBoundable<T>(arg: ConfigBoundable<T>): arg is ConfigTupleBoundable<T> {
  return typeof arg === 'object' && arg !== null && 'tuples' in arg && 'dependentOn' in arg;
}

export function getConfigBoundableState<T>(boundable: ConfigBoundable<T>, mapping: BoundScopeElementMapping ): T {
  if (isConfigTupleBoundable(boundable)) {
    const scope = boundable.scope ? boundable.scope : 'self'
    const mappingElement = mapping[scope]
    const element = mappingElement ? mappingElement : mapping.chart
    return configTupleBoundableByIndices(getBoundStateFromCSS(element), boundable)
  }
  return boundable
}

function configTupleBoundableByIndices<T>(indices: LenghtDimensionIndices, arg: ConfigTupleBoundable<T>) {
  const currentIndex = indices[arg.dependentOn]
  let tuple = arg.tuples[0]
  for (let i = 1; i < arg.tuples.length; i++) {
    if (arg.tuples[i][0] <= currentIndex) tuple = arg.tuples[i]
  }
  return tuple[1]
}
