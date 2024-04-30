import {easeCubicOut, select, Selection} from 'd3';
import {Position, positionToTransformAttr} from '../../../index';
import {classesForSelection, cssVarFromSelection} from "../../../utilities/d3/util";
import {RenderElement} from "../../../utilities/graphic-elements/render-element";
import {Orientation, Sign} from "../../../constants/types";
import {addEnterClass, addExitClass} from "../../../utilities/d3/transition";

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

export function seriesLabelJoin(seriesS: Selection, joinS: Selection<Element, Label>): void {
  const tDurationString = cssVarFromSelection(seriesS, '--transition-time-label-enter-ms')
  const tDuration = tDurationString ? parseInt(tDurationString) : 250
  joinS
    .join(
      (enter) =>
        enter
          .append('text')
          .classed('label', true)
          .each((d, i, g) => positionToTransformAttr(select(g[i]), d))
          .call(s => addEnterClass(s, tDuration))
          .call((s) => seriesS.dispatch('enter', { detail: { selection: s } })),
      undefined,
      (exit) =>
        exit.call((s) => addExitClass(s, tDuration).on('end', () => {
          exit.remove().call((s) => seriesS.dispatch('exit', {detail: {selection: s}}))
        }))
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
    .call((s) => seriesS.dispatch('update', { detail: { selection: s } }));
}
