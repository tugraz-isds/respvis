import {select, Selection} from "d3";

export function checkBoxItemsRender(itemsS: Selection<any, string>) {
  itemsS.each(function (d, i, g) {
    const labelS = select(g[i]).selectAll('label')
      .data([d])
      .join('label')
    labelS.selectAll('input[type="checkbox"]')
      .data([d])
      .join('input')
      .attr('type', 'checkbox')
    labelS.selectAll('span')
      .data([d])
      .join('span')
      .text(d => d)
  })
}
