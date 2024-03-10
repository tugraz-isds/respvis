import {select, Selection} from "d3";

export function roundSVGAttributes(selection: Selection<SVGElement>, decimals = 2, nested = true) {
  selection.selectAll<SVGElement, any>('*').each((d, i , g) => {
    const elementS = select(g[i])
      elementS.each(function () {
      for (let i = 0; i < this.attributes.length; i++) {
        const attribute = this.attributes[i]
        const val = Number.parseFloat(attribute.value)
        if (isNaN(val)) continue
        elementS.attr(attribute.name, val.toFixed(decimals))
      }
    })
  })
}
