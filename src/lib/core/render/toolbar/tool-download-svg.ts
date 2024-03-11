import {BaseType, select, Selection, ValueFn} from 'd3';
import {elementComputedStyleWithoutDefaults, elementSVGPresentationAttrs,} from '../../utilities/element';
import {roundSVGAttributes} from "./tool-download-svg/optimize-svg";

// TODO: maybe SVGO could be used to optimize the downloaded SVG? https://github.com/svg/svgo

export function toolDownloadSVGRender(selection: Selection<BaseType>): void {
  selection
    .selectAll<HTMLLIElement, any>('.tool-download-svg')
    .data([null])
    .join('li')
    .classed('tool-download-svg', true)
    .text('Download SVG')
    .on('click', function () {
      select(this.closest('.window-rv'))
        .selectAll<SVGSVGElement, unknown>('.layouter > svg.chart')
        .call((s) => chartDownload(s, 'chart.svg'));
    });
}

export function chartDownload<Datum>(
  chartSelection: Selection<SVGSVGElement, Datum>,
  fileName: string | ValueFn<SVGSVGElement, Datum, string>
): void {
  chartSelection.each((d, i, g) => {
    const clonedChart = <SVGSVGElement>g[i].cloneNode(true);
    const width = clonedChart.getAttribute('width');
    const height = clonedChart.getAttribute('height');
    clonedChart.setAttribute('viewBox', `0, 0, ${width}, ${height}`);
    clonedChart.removeAttribute('width');
    clonedChart.removeAttribute('height');
    clonedChart.removeAttribute('x');
    clonedChart.removeAttribute('y');

    //TODO: Create options for what should finally be included in downloaded svg

    // const activeCSSRules = getActiveCSSRulesForElement(elementFromSelection(chartSelection))
    // const styleTag = document.createElement("style")
    // activeCSSRules.forEach((rule) => {
    //   styleTag.appendChild(document.createTextNode(rule))
    // })
    // clonedChart.appendChild(styleTag);
    // copyInlineStyles(clonedChart, g[i])

    attrsFromComputedStyle(clonedChart, g[i]);

    roundSVGAttributes(select(clonedChart), 1)

    const cloneContainer = document.createElement('div');
    cloneContainer.append(clonedChart);

    const cloneHTML = cloneContainer.innerHTML.replace(
      / (layout|bounds|data-ignore-layout|data-ignore-layout-children)=".*?"/g,
      ''
    );

    const blobType = 'image/svg+xml;charset=utf-8';
    const blob = new Blob([cloneHTML], { type: blobType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    fileName = fileName instanceof Function ? fileName.call(g[i], d, i, g) : fileName;

    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  });
}

function copyInlineStyles(target: Element, source: Element) {
  const style = (source as SVGElement).style.cssText
  if (style) {
    (target as SVGElement).style.cssText = style
    console.log(style)
  }
  for (let i = 0; i < source.children.length; ++i) {
    copyInlineStyles(target.children[i], source.children[i]);
  }
}
function attrsFromComputedStyle(target: Element, source: Element): void {
  const style = elementComputedStyleWithoutDefaults(source, elementSVGPresentationAttrs);
  for (let prop in style) {
    target.setAttribute(prop, style[prop]);
  }
  for (let i = 0; i < source.children.length; ++i) {
    attrsFromComputedStyle(target.children[i], source.children[i]);
  }
}

