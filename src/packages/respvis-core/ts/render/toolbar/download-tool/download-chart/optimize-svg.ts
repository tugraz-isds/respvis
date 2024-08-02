import {select, Selection} from "d3";
import {Renderer} from "../../../chart/renderer";

export function optimizeSVG(selection: Selection<SVGElement>, renderer: Renderer) {
  const { downloadAttributeMaxDecimals,
    downloadAttributeMaxDecimalsActive,
    downloadRemoveBgElements
  } = renderer.windowS.datum().settings.state
  if (downloadAttributeMaxDecimalsActive) roundSVGAttributes(selection, parseInt(downloadAttributeMaxDecimals))
  if (downloadRemoveBgElements) removeBackgrounds(selection)
}

export function roundSVGAttributes(selection: Selection<SVGElement>, decimals = 2) {
  selection.selectAll<SVGElement, any>('*').each((d, i , g) => {
    const elementS = select(g[i])
      elementS.each(function () {
      for (let i = 0; i < this.attributes.length; i++) {
        const regex = /(\d+\.\d+)|(\.\d+)/g
        const attribute = this.attributes[i]
        const modifiedValue = this.attributes[i].value.replace(regex, match => {
          return parseFloat(match).toFixed(decimals)
        })
        elementS.attr(attribute.name, modifiedValue)
      }
    })
  })
}

export function removeBackgrounds(selection: Selection<SVGElement>) {
  selection.selectAll<SVGGElement, any>('.background, .background-svgonly')
    .filter(function () {
      return !(this.parentNode instanceof SVGClipPathElement) //clippath backgrounds must remain to give clippath bounds!
    }).remove()
}
