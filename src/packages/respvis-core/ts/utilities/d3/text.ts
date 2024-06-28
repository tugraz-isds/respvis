import {Selection} from "d3";
import {Rect} from "../../data";
import {positionToTransformAttr} from "../../data/position";

export function centerSVGTextBaseline(svgS: Selection<SVGTextElement>, bounds: Rect) {
  const textElement = svgS.node()
  if (!textElement) return

  const textSVGWidth = textElement.getBBox().width
  svgS.attr('x', () => -textSVGWidth / 2 + bounds.width / 2)
  svgS.attr('y', () => bounds.height / 2)
  svgS.call(((s) => positionToTransformAttr(s, bounds)))
}
