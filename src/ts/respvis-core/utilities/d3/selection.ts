import {BaseType, CustomEventParameters, select, selectAll, Selection, Transition} from 'd3';

declare module 'd3' {
  export interface Transition<
    // provide default type parameters
    GElement extends BaseType = BaseType,
    Datum = unknown,
    PElement extends BaseType = BaseType,
    PDatum = unknown
  > {}
}

declare module 'd3' {
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

export type SelectionOrTransition<
  // provide default type parameters
  GElement extends BaseType = BaseType,
  Datum = unknown,
  PElement extends BaseType = BaseType,
  PDatum = unknown
> = Selection<GElement, Datum, PElement, PDatum> | Transition<GElement, Datum, PElement, PDatum>;

export function isSelection<GElement extends BaseType, Datum, PElement extends BaseType, PDatum>(
  selectionOrTransition: SelectionOrTransition<GElement, Datum, PElement, PDatum>
): selectionOrTransition is Selection<GElement, Datum, PElement, PDatum> {
  return selectionOrTransition['join'];
}

export function isTransition<GElement extends BaseType, Datum, PElement extends BaseType, PDatum>(
  selectionOrTransition: SelectionOrTransition<GElement, Datum, PElement, PDatum>
): selectionOrTransition is Transition<GElement, Datum, PElement, PDatum> {
  return !isSelection(selectionOrTransition);
}

export function mapSelection<E extends BaseType, D>(selection: Selection<any, D>, mapper: (selection: Selection<any, D>) => Selection<E, D>) {
  let nodes: E[] = []
  selection.each((d, i, g) => {
    const mappingNode = mapper(select(g[i])).node()
    if (mappingNode) nodes.push(mappingNode)
  })
  return selectAll<E, D>(nodes)
}

export function applyClassList(selection: Selection, classList: string[], active: boolean) {
  classList.forEach(classToApply => selection.classed(classToApply, active))
  return selection
}
