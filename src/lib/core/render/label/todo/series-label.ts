import {easeCubicOut, select, Selection} from 'd3';
import {Position, positionToTransformAttr} from '../../../index';
import {classesForSelection} from "../../../utilities/d3/util";
import {RenderElement} from "../../../utilities/graphic-elements/render-element";
import {Orientation, Sign} from "../../../constants/types";

export interface Label extends Position {
  text: string
  key: string,
  sign?: Sign,
}

type LabelSeriesProps<D extends RenderElement> = {
  elements: D[]
  classes: string[]
  orientation: Orientation
}

export function labelSeriesFromElementsRender<D extends RenderElement>(parentS: Selection, props: LabelSeriesProps<D>) {
  const { elements, classes, orientation} = props
  const {selector, names} = classesForSelection(classes)
  const labels = elements.flatMap(element => element.getLabel(orientation))
  const labelS = parentS.selectAll<SVGGElement, any>(selector)
    .data([null])
    .join('g')
    .classed(names, true)
    .attr('data-ignore-layout-children', true)
    .call((s) => labelsRender(s, labels))
  return labelS
}

export function labelsRender<D extends Label>(seriesS: Selection, labels: D[]) {
  return seriesS.selectAll<SVGTextElement, D>('text')
    .data(labels, (d) => d.key)
    .call((s) => seriesLabelJoin(seriesS, s));
}

export function seriesLabelJoin(
  seriesSelection: Selection,
  joinSelection: Selection<Element, Label>
): void {
  joinSelection
    .join(
      (enter) =>
        enter
          .append('text')
          .classed('label', true)
          .each((d, i, g) => positionToTransformAttr(select(g[i]), d))
          .attr('font-size', '0em')
          .attr('opacity', 0)
          .call((s) =>
            s.transition('enter').duration(250).attr('font-size', '1em').attr('opacity', 1)
          )
          .call((s) => seriesSelection.dispatch('enter', { detail: { selection: s } })),
      undefined,
      (exit) =>
        exit
          .classed('exiting', true)
          .call((s) =>
            s.transition('exit').duration(250).attr('font-size', '0em').attr('opacity', 0).remove()
          )
          .call((s) => seriesSelection.dispatch('exit', { detail: { selection: s } }))
    )
    .each((d, i, g) =>
      select(g[i])
        .transition('position')
        .duration(250)
        .ease(easeCubicOut)
        .call((t) => positionToTransformAttr(t, d))
    )
    .text((d) => d.text)
    .attr('data-key', (d) => d.key)
    .attr( 'data-sign', (d) => d.sign ? d.sign : null)
    .call((s) => seriesSelection.dispatch('update', { detail: { selection: s } }));
}
