import {select, Selection} from "d3";
import {Rect, rectFromString} from "../../data";
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
  svgS
    .attr('x', () => -textSVGWidth / 2 + bounds.width / 2)
    .attr('y', () => bounds.height / 2)
    .call(((s) => positionToTransformAttr(s, bounds)))
}


export function wrapTextByTwinWidth(textS: Selection<SVGTextElement>) {
  textS.each(function (d, i, g) {
    const singleTextS = select(g[i])
    const el = singleTextS.node()
    const bounds = singleTextS.attr('bounds')
    const rect = bounds ? rectFromString(bounds) : undefined
    const wrapTextActive = el ? getComputedStyle(el).getPropertyValue('--text-wrap') : 'false'
    if (!el || !rect || wrapTextActive !== 'true') return
    wrapText(select(g[i]), rect.width)
  })
}

//based on https://gist.github.com/mbostock/7555321
function wrapText(textS: Selection<SVGTextElement>, width: number) {
  textS.each(function () {
    let offset = 0.5 // due to baseline central
    let lineHeight = 1.1

    let text = select(this)
    let words = text.text().split(/\s+/).reverse()
    let word = words.pop()

    if (!word) return
    let line: string[] = []
    let tspan = text.text('').append("tspan").attr("x", 0).attr("y", 0).attr("dy", offset + "em");

    while (word) {
      line.push(word)
      tspan.text(line.join(" "))

      if (tspan.node()!.getComputedTextLength() <= width) {
        word = words.pop()
        continue
      }

      if (line.length < 2) {
        word = words.pop()
      } else {
        word = line.pop()
        tspan.text(line.join(" "));
      }

      line = []
      tspan = text.append("tspan")
        .attr("x", 0)
        .attr("dy", lineHeight + "em")
    }

    const textAlign = getComputedStyle(text.node()!).textAlign
    if (textAlign && textAlign === 'center')
    text.selectAll<SVGTSpanElement, any>('tspan').each(function() {
      const diff = width - this.getComputedTextLength()
      select(this).attr('x', diff / 2)
    })
  })
}
