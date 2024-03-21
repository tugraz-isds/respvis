import {select, Selection} from "d3";

export function roundSVGAttributes(selection: Selection<SVGElement>, decimals = 2, nested = true) {
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
