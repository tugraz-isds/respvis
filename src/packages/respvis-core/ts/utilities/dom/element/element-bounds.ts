import {Rect, rectRound} from "../../geometry";

export function elementRelativeBounds(element: Element): Rect {
  console.assert(element.isConnected, 'Element needs to be attached to the DOM.');
  const bounds = element.getBoundingClientRect();
  const parentBounds = element.parentElement!.getBoundingClientRect();
  return rectRound(
    {
      x: bounds.x - parentBounds.x,
      y: bounds.y - parentBounds.y,
      width: bounds.width,
      height: bounds.height,
    },
    2
  );
}

export function elementAbsoluteBounds(element: SVGGraphicsElement) {
  const viewPortE = element.closest('svg')
  console.assert(element.isConnected && viewPortE, 'Element needs to be attached to the DOM and must have SVG Ancestor.');
  if (!viewPortE || !('getBBox' in element)) return rectRound(element.getBoundingClientRect(), 2)
  const elementBoundsFromViewport = element.getBoundingClientRect()
  const elementBoundsBBox = element.getBBox()
  const finalBounds = {
    x: elementBoundsFromViewport.x - elementBoundsBBox.x,
    y: elementBoundsFromViewport.y - elementBoundsBBox.y,
    width: elementBoundsBBox.width,
    height: elementBoundsBBox.height
  }
  return rectRound(finalBounds, 2);
}
