import {Selection} from "d3";

export function renderSVGSeries(parentS: Selection, rawSVGs: string[]) {
  const parser = new DOMParser()
  const svgElements = rawSVGs.map(rawSVG => {
    const svgDocument = parser.parseFromString(rawSVG, 'image/svg+xml')
    return svgDocument.documentElement.cloneNode(true) as SVGSVGElement
  })

  parentS.selectAll('svg')
    .data(svgElements)
    .join(enter => enter.append(() => enter.datum())
      ,undefined,
      exit => exit.remove()
    )
  return parentS
  // parentS.html(rawSVG) //alternative
}
