import {select, Selection} from 'd3';
import {positionToTransformAttr} from '../../utilities/geometry/position/position';
import {
  rectEquals,
  rectFromString,
  rectToAttrs,
  rectToString,
  rectToViewBox,
} from '../../utilities/geometry/shapes/rect/rect';
import {circleInsideRect, circleToAttrs} from '../../utilities/geometry/shapes/circle';
import {cssVars} from "../../constants/cssVars";
import {ellipseInsideRect, ellipseToAttrs} from "../../utilities/geometry/shapes/ellipse";
import {SVGTwinInformation} from "./layouter-compute";
import {positionSVGTextToLayoutCenter} from "../../utilities";
import {elementAbsoluteBounds, elementRelativeBounds} from "../../utilities/dom/element/element-bounds";

export function layoutNodeStyleAttr(selection: Selection<HTMLDivElement, SVGTwinInformation>): void {
  selection.each((d, i, g) => {
    const propTrue = (p: string) => p.trim() === 'true';
    const computedStyleHTMLElement = window.getComputedStyle(g[i]);
    const fitWidth = propTrue(computedStyleHTMLElement.getPropertyValue('--fit-width'));
    const fitHeight = propTrue(computedStyleHTMLElement.getPropertyValue('--fit-height'));

    if (fitWidth || fitHeight) {
      const bbox = d.element.getBoundingClientRect();
      if (fitWidth) g[i].style.setProperty('width', `${bbox.width}px`)
      if (fitHeight) g[i].style.setProperty('height', `${bbox.height}px`)
    }

    for (let varIndex = 0, len = cssVars.length; varIndex < len; varIndex++) {
      const prop = d.element.style.getPropertyValue(cssVars[varIndex])
      if (prop !== undefined) g[i].style.setProperty(cssVars[varIndex], prop)
    }
  });
}

export function layoutNodeClassAttr(selection: Selection<HTMLDivElement, SVGTwinInformation>): void {
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

export function layoutNodeDataAttrs(selection: Selection<HTMLDivElement, SVGTwinInformation>): void {
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

export function layoutNodeBounds(selection: Selection<HTMLDivElement, SVGTwinInformation>): boolean {
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
          svgS.call((s) => rectToAttrs(s, bounds));
          svgS.call((s) => rectToViewBox(s, bounds));
          break;
        case 'rect':
          svgS.call((s) => rectToAttrs(s, bounds));
          break;
        case 'circle':
          svgS.call((s) => circleToAttrs(s, circleInsideRect(bounds)));
          break;
        case 'ellipse':
          svgS.call((s) => ellipseToAttrs(s, ellipseInsideRect(bounds)));
          break;
        case 'text':
          positionSVGTextToLayoutCenter(svgS as Selection<SVGTextElement>, bounds)
          break;
        default:
          svgS.call((s) => positionToTransformAttr(s, bounds));
      }
    }
  });
  return anyChanged;
}
