import {BaseType, CustomEventParameters} from "d3";

declare module 'd3' {
  export interface Transition<
    // provide default type parameters
    GElement extends BaseType = BaseType,
    Datum = unknown,
    PElement extends BaseType = BaseType,
    PDatum = unknown
  > {}
  export interface Selection<
    // provide default type parameters
    GElement extends BaseType = BaseType,
    Datum = unknown,
    PElement extends BaseType = BaseType,
    PDatum = unknown
  > {
    attr(name: string): string | null; // add null return value
    dispatch(type: string, parameters?: Partial<CustomEventParameters>): this; // allow Partial parameters
  }
}
