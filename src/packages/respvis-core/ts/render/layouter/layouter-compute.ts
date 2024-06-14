import {select, Selection} from "d3";
import {rectFromString, rectToString} from "../../utilities";
import {layoutNodeBounds, layoutNodeClassAttr, layoutNodeDataAttrs, layoutNodeStyleAttr} from "./layout-elements";
import {layoutNodeChildren} from "./layout-node-children";

export function layouterRender(selection: Selection<HTMLDivElement>): void {
  selection.classed('layouter', true);
}

export type SVGTwinInformation = {
  element: SVGElement
  ignoredByAncestor: boolean
  ignoreBounds: boolean
}

export function layouterCompute(layouterS: Selection<HTMLDivElement>) {
  if (!(layouterS.node() as Element).isConnected) return

  const layouterChildDivS = layoutLayouter(layouterS.node()!)
  return layoutContainerCompute(layouterChildDivS, layouterS)
}

function layoutLayouter(layouter: HTMLDivElement): Selection<HTMLDivElement, SVGTwinInformation> {
  return select(layouter)
    .selectChildren<HTMLDivElement, SVGTwinInformation>('.layout.layout-container')
    .data([{
      element: select(layouter).selectChildren('svg').node()! as SVGElement,
      ignoredByAncestor: false,
      ignoreBounds: false
    }])
    .join('div')
  // .classed('layout layout-container', true)
}

export function layoutContainerCompute(layoutContainerS: Selection<HTMLDivElement, SVGTwinInformation>,
                                       layouterS: Selection<HTMLDivElement>) {
  if (!(layoutContainerS.node() as Element).isConnected) return false
  let anyBoundsChanged = false

  layoutContainerS.each(function () {
    const layoutRootS = select<HTMLDivElement, SVGTwinInformation>(this)

    let layoutS: Selection<HTMLDivElement, SVGTwinInformation> = layoutRootS
    while (!layoutS.empty()) {
      layoutNodeClassAttr(layoutS);
      layoutNodeStyleAttr(layoutS);
      layoutNodeDataAttrs(layoutS);
      layoutS = layoutNodeChildren(layoutS);
    }

    layouterS.selectAll<HTMLDivElement, SVGElement>('.layout').each(function () {
      const layoutS = select<HTMLDivElement, SVGTwinInformation>(this);
      if (layoutS.datum().ignoreBounds) return
      const boundsChanged = layoutNodeBounds(layoutS);
      anyBoundsChanged = anyBoundsChanged || boundsChanged;
    });

    if (anyBoundsChanged) {
      const bounds = rectFromString(select(layoutRootS.datum().element).attr('bounds')!);
      layoutRootS
        .style('left', bounds.x)
        .style('top', bounds.y)
        .attr('x', null)
        .attr('y', null)
        .attr('width', null)
        .attr('height', null)
        .attr('viewBox', rectToString({...bounds, x: 0, y: 0}));
      anyBoundsChanged = true
    }
  })

  if (anyBoundsChanged) {
    layoutContainerS.dispatch('boundschange')
  }
  return anyBoundsChanged
}
