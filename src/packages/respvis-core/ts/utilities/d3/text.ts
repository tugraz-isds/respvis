import {Selection} from "d3";
import {Rect} from "../../data";
import {positionToTransformAttr} from "../geometry/position";

/**
 * Note that the SVG text element must have a dominant-baseline value of "central"
 * for this function to work properly.
 * @param svgS SVG text element
 * @param bounds Bounds of Layout Twin Element
 */
export function positionSVGTextToLayoutCenter(svgS: Selection<SVGTextElement>, bounds: Rect) {
  const textElement = svgS.node()
  if (!textElement) return

  const textSVGWidth = textElement.getBBox().width
  svgS.attr('x', () => -textSVGWidth / 2 + bounds.width / 2)
  svgS.attr('y', () => bounds.height / 2)
  svgS.call(((s) => positionToTransformAttr(s, bounds)))
}
