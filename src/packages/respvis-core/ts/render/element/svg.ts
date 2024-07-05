import {Selection} from "d3";

export function renderSVG(parentS: Selection, rawSVG: string) {
  const parser = new DOMParser()
  const svgDocument = parser.parseFromString(rawSVG, 'image/svg+xml')
  const svgElement = svgDocument.documentElement.cloneNode(true) as SVGSVGElement
  parentS.selectAll('svg')
    .data([svgElement])
    .join(enter => enter.append(() => enter.datum()))
  return parentS
}
