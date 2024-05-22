import {easeCubicOut, select, Selection} from 'd3';
import {
  addEnterClass,
  addExitClass,
  classesForSelection,
  cssVarFromSelection,
  positionToTransformAttr,
  RenderElement
} from "../../utilities";
import {Orientation} from "../../constants";
import {Label} from "respvis-core/render/label/label";

type LabelSeriesProps<D extends RenderElement> = {
  elements: D[]
  classes: string[]
  orientation: Orientation
};

export function renderLabelSeries<D extends RenderElement>(parentS: Selection, props: LabelSeriesProps<D>) {
  const { elements, classes, orientation} = props
  const {selector, names} = classesForSelection(classes)
  const labels = elements.flatMap(element => element.getLabel(orientation))
  return parentS.selectAll<SVGGElement, any>(selector)
    .data([null])
    .join('g')
    .classed(names, true)
    .attr('data-ignore-layout-children', true)
    .call((s) => renderLabels(s, labels))
}

export function renderLabels<D extends Label>(seriesS: Selection, labels: D[]) {
  return seriesS.selectAll<SVGTextElement, D>('text')
    .data(labels, (d) => d.key)
    .call((s) => joinLabelSeries(seriesS, s));
}

function joinLabelSeries(seriesS: Selection, joinS: Selection<Element, Label>): void {
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
