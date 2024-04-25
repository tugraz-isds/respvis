import {select, selectAll, Selection} from 'd3';
import {elementAbsoluteBounds, elementRelativeBounds} from '../utilities/element';
import {centerSVGTextBaseline, positionToTransformAttr} from '../utilities/position/position';
import {
  rectBottomLeft,
  rectEquals,
  rectFromString,
  rectToAttrs,
  rectTopRight,
  rectToString,
} from '../utilities/graphic-elements/rect';
import {circleInsideRect, circleToAttrs} from '../utilities/graphic-elements/circle';
import {cssVars} from "../constants/cssVars";

function layoutNodeStyleAttr(selection: Selection<HTMLDivElement, SVGTwinInformation>): void {
  selection.each((d, i, g) => {
    const propTrue = (p: string) => p.trim() === 'true';
    const computedStyleHTMLElement = window.getComputedStyle(g[i]);
    const computedStyleSVGElement = window.getComputedStyle(d.element);
    const fitWidth = propTrue(computedStyleHTMLElement.getPropertyValue('--fit-width'));
    const fitHeight = propTrue(computedStyleHTMLElement.getPropertyValue('--fit-height'));

    let style = '';
    if (fitWidth || fitHeight) {
      const bbox = d.element.getBoundingClientRect();
      if (fitWidth) style += `width: ${bbox.width}px; `;
      if (fitHeight) style += `height: ${bbox.height}px; `;
    }
    g[i].setAttribute('style', style);
    for (let varIndex = 0, len = cssVars.length; varIndex < len; varIndex++) {
      g[i].style.setProperty(cssVars[varIndex], computedStyleSVGElement.getPropertyValue(cssVars[varIndex]))
    }
  });
}

function layoutNodeClassAttr(selection: Selection<HTMLDivElement, SVGTwinInformation>): void {
  selection.each((d, i, g) => {
    select(g[i]).attr('class', d.element.getAttribute('class'))
      .each((_, i, g) => select(g[i]).classed(d.element.tagName, true))
      .classed('layout', true);
  })
  // Alternatively preserve classes method:
  // selection
  //   .each((d, i, g) => {
  //     const classList = d.element.getAttribute('class')?.split(/\s+/) ?? []
  //     g[i].classList.add(...classList)
  //     select(g[i]).classed(d.element.tagName, true)
  //   })
  //   .classed('layout', true);
}

function layoutNodeDataAttrs(selection: Selection<HTMLDivElement, SVGTwinInformation>): void {
  selection.each((svgTwin, i, g) => {
    const layoutE = g[i];
    const svgE = svgTwin.element

    const dataAttrsToObj = (attrs: NamedNodeMap) =>
      Array.from(attrs)
        .filter((a) => a.name.startsWith('data-'))
        .reduce((obj, a) => Object.assign(obj, {[`${a.name}`]: a.value}), {});

    const layoutAttrs = dataAttrsToObj(layoutE.attributes);
    const svgAttrs = dataAttrsToObj(svgE.attributes);

    // remove layoutE data attrs that don't exist on svgE
    Object.keys(layoutAttrs)
      .filter((attr) => svgAttrs[attr] !== undefined)
      .forEach((attr) => layoutE.removeAttribute(attr));

    // set svgE data attrs on layoutE
    Object.keys(svgAttrs).forEach((attr) => layoutE.setAttribute(attr, svgAttrs[attr]));
  });
}

function layoutNodeBounds(selection: Selection<HTMLDivElement, SVGTwinInformation>): boolean {
  let anyChanged = false;
  selection.each(function (svgTwin) {
    const svgE = svgTwin.element
    const svgS = select(svgE);
    if (this.classList.contains('layout-container-positioner')) return
    const prevBounds = rectFromString(svgS.attr('bounds') || '0, 0, 0, 0');
    const bounds = elementRelativeBounds(this);
    const changed = !rectEquals(prevBounds, bounds, 1);

    // if (svgE.classList.contains('axis-y')) {
    //   const epsilon = 1
    //   const xAbs = Math.abs(bounds.x - prevBounds.x)
    //   const yAbs = Math.abs(bounds.y - prevBounds.y)
    //   const heightAbs = Math.abs(bounds.height - prevBounds.height)
    //   const widthAbs = Math.abs(bounds.width - prevBounds.width)
    //   if (xAbs > epsilon)  {
    //     console.log(svgE.classList, xAbs, 'X')
    //   }
    //   if (yAbs > epsilon)  {
    //     console.log(svgE.classList, yAbs, 'Y')
    //   }
    //   if (widthAbs > epsilon)  {
    //     console.log(svgE.classList, widthAbs, 'WIDTH')
    //   }
    //   if (heightAbs > epsilon)  {
    //     console.log(svgE.classList, heightAbs, 'Height')
    //   }
    // }

    anyChanged = anyChanged || changed;


    const svgParentE = svgE.parentElement as unknown
    if (this.classList.contains('layout-container-positioner') && svgParentE instanceof SVGElement) {
      //TODO: maybe use css variables for this
      const parentBounds = elementAbsoluteBounds(svgParentE as SVGGraphicsElement)
      select(this).style('top', parentBounds.y + 'px')
      select(this).style('left', parentBounds.x + 'px')
      return anyChanged
    }

    if (changed) {
      svgS.attr('bounds', rectToString(bounds));
      switch (svgE.tagName) {
        case 'svg':
        case 'rect':
          svgS.call((s) => rectToAttrs(s, bounds));
          break;
        case 'circle':
          svgS.call((s) => circleToAttrs(s, circleInsideRect(bounds)));
          break;
        case 'line':
          const bottomLeft = rectBottomLeft(bounds);
          const topRight = rectTopRight(bounds);
          svgS
            .attr('x1', bottomLeft.x)
            .attr('y1', bottomLeft.y)
            .attr('x2', topRight.x)
            .attr('y2', topRight.y);
          break;
        case 'text':
          select(this)
          svgS.call(((s) => positionToTransformAttr(s, bounds)));
          centerSVGTextBaseline(svgS as Selection<SVGTextElement>)
          break;
        default:
          svgS.call((s) => positionToTransformAttr(s, bounds));
      }
    }
  });
  return anyChanged;
}

function layoutNodeChildren(
  selection: Selection<HTMLDivElement, SVGTwinInformation>
): Selection<HTMLDivElement, SVGTwinInformation> {
  const childS = selection
    .selectChildren<HTMLDivElement, SVGTwinInformation>('.layout')
    .data((d) => layedOutChildren(d))
    .join(enter => {
      const div = enter.append('div')
      div.each(function (d, i, g) {
        if (!d.element.classList.contains('layout-container')) return
        select(g[i])
          .classed('layout layout-container-positioner', true)
          .style('position', 'fixed')
      })
      return div
    })
    .each(function (d, i, g) {
      if (!select(g[i]).classed('layout layout-container-positioner')) return
      select(g[i]).selectChildren('.layout.layout-container')
        .data([d])
        .join('div')
        .classed('layout layout-container', true)
    })

  const filteredChildS = childS.filter(':not(.layout-container-positioner)')
  const filteredChildPositionerS = childS.filter('.layout-container-positioner').selectChildren<HTMLDivElement, SVGTwinInformation>('*')

  return selectAll<HTMLDivElement, SVGTwinInformation>([...filteredChildS.nodes(), ...filteredChildPositionerS.nodes()])
}

function layedOutChildren(parent: SVGTwinInformation): SVGTwinInformation[] {
  let parentIgnoresChildrenAttr = false
  const parentSFiltered = select(parent.element).filter((d, i, g) => {
    parentIgnoresChildrenAttr = !!select(g[i]).attr('data-ignore-layout-children')

    const hasNoLayoutContainerDescandant = select(g[i]).selectAll('.layout-container').empty()
    return !(parentIgnoresChildrenAttr && hasNoLayoutContainerDescandant)
  })

  let information: SVGTwinInformation[] = []
  parentSFiltered.selectChildren<SVGElement, unknown>(':not(.layout)')
    .each(function (d, i, g) {
      const isLayoutContainer = select(g[i]).classed('layout-container')
      const ignoreSelfAttr = select(g[i]).attr('data-ignore-layout')
      const hasNoLayoutContainerDescendant = select(g[i]).selectAll('.layout-container').empty()

      const ignoreBoundsBecauseOfParent = parentIgnoresChildrenAttr && !isLayoutContainer
      const ignoreBoundsBecauseOfSelf = ignoreSelfAttr && !isLayoutContainer
      const ignoreBoundsBecauseInBetween = parent.ignoredByAncestor && !isLayoutContainer
      const ignoreBounds = ignoreBoundsBecauseOfParent || ignoreBoundsBecauseOfSelf || ignoreBoundsBecauseInBetween
      if (ignoreBounds && hasNoLayoutContainerDescendant) return

      information.push({
        element: this,
        ignoredByAncestor: (parentIgnoresChildrenAttr || ignoreSelfAttr) ? true :
          parent.ignoredByAncestor && !isLayoutContainer,
        ignoreBounds
      })
    })
  return information
}

export function layouterRender(selection: Selection<HTMLDivElement>): void {
  selection.classed('layouter', true);
}

export function layouterCompute(layouterS: Selection<HTMLDivElement>) {
  if (!(layouterS.node() as Element).isConnected) return

  const layouterChildDivS = layoutLayouter(layouterS.node()!)
  return layoutContainerCompute(layouterChildDivS, layouterS)
}

type SVGTwinInformation = {
  element: SVGElement
  ignoredByAncestor: boolean
  ignoreBounds: boolean
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
