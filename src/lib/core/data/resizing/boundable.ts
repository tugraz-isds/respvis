import {LengthDimension, SVGHTMLElement} from "../../constants/types";
import {getBoundStateFromCSS, LenghtDimensionIndices} from "./bounds";

type BoundScopeRequired = 'chart'
type BoundScopeOptional = 'self'
export type BoundScope = BoundScopeOptional | BoundScopeRequired
export type BoundScopeElementMapping = {
  [k in BoundScopeOptional]?: SVGHTMLElement
} & {
  [k in BoundScopeRequired]: SVGHTMLElement
}

export type ConfigTupleBoundableValue<T> = {
  tuples: [index: number, value: T][]
  dependentOn: LengthDimension,
  scope?: BoundScope
}

export type ConfigTupleBoundableCallback<T> = {
  value: T,
  tuples: [index: number, callback: (value: T) => any][],
  dependentOn: LengthDimension,
  scope?: BoundScope
}

export function isConfigTupleBoundableCallback<T>(arg: ConfigBoundable<T>): arg is ConfigTupleBoundableCallback<T> {
  return typeof arg === 'object' && arg !== null && 'tuples' in arg && 'dependentOn' in arg && 'value' in arg;
}

export type ConfigTupleBoundable<T> = ConfigTupleBoundableValue<T> | ConfigTupleBoundableCallback<T>

export function isConfigTupleBoundable<T>(arg: ConfigBoundable<T>): arg is ConfigTupleBoundable<T> {
  return typeof arg === 'object' && arg !== null && 'tuples' in arg && 'dependentOn' in arg;
}

export type ConfigBoundable<T> = ConfigTupleBoundable<T> | T

export function getConfigBoundableState<T>(boundable: ConfigBoundable<T>, mapping: BoundScopeElementMapping ): T {
  if (isConfigTupleBoundable(boundable)) {
    const scope = boundable.scope ? boundable.scope : 'chart'
    const mappingElement = mapping[scope]
    const element = mappingElement ? mappingElement : mapping.chart
    return configTupleBoundableByIndices(getBoundStateFromCSS(element), boundable)
  }
  return boundable
}

function configTupleBoundableByIndices<T>(indices: LenghtDimensionIndices, boundable: ConfigTupleBoundable<T>) {
  const currentIndex = indices[boundable.dependentOn]
  if (isConfigTupleBoundableCallback(boundable)) {
    let tuple = boundable.tuples[0]
    for (let i = 1; i < boundable.tuples.length; i++) {
      if (boundable.tuples[i][0] <= currentIndex) tuple = boundable.tuples[i]
    }
    tuple[1](boundable.value)
    return boundable.value
  }

  let tuple = boundable.tuples[0]
  for (let i = 1; i < boundable.tuples.length; i++) {
    if (boundable.tuples[i][0] <= currentIndex) tuple = boundable.tuples[i]
  }
  return tuple[1]
}
