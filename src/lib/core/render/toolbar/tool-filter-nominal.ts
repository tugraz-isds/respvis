import {create, select, Selection} from 'd3';
import {menuDropdownRender} from '../../menu-dropdown';
import {SeriesCheckbox, seriesCheckboxData, seriesCheckboxRender} from '../../series-checkbox';

export interface ToolFilterNominal {
  text: string
  options: string[]
  keys: string[]
  class: string
}

export function toolFilterNominalData(data: Partial<ToolFilterNominal>): ToolFilterNominal {
  const options = data.options || [];
  return {
    text: data.text || 'Filter',
    options: options,
    keys: data.keys || options,
    class: '',
  };
}

export function toolFilterNominalRender(selection: Selection, data: ToolFilterNominal): void {
  const nominalSelection = selection
    .selectAll<HTMLLIElement, ToolFilterNominal>(`.tool-filter-nominal.${data.class}`)
    .data([data])
    .join('li')
    .classed(`tool-filter-nominal ${data.class}`, true).call((s) => menuDropdownRender(s));

  nominalSelection.each((d, i, g) => {
    const s = select(g[i]);
    s.selectAll('.text').text(d.text);
    s.selectAll<HTMLUListElement, SeriesCheckbox>('.items')
      .datum(
        seriesCheckboxData({
          container: () => create('li').node()!,
          labels: d.options,
          keys: d.keys,
        })
      )
      .call((s) => seriesCheckboxRender(s));
  });
}
