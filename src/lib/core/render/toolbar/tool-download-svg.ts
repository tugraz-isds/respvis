import {BaseType, select, Selection, ValueFn} from 'd3';
import {roundSVGAttributes} from "./download-tool/optimize-svg";
import {Renderer} from "../chart/renderer";
import {applyDownloadStyle} from "./download-tool/apply-download-style";

// TODO: maybe SVGO could be used to optimize the downloaded SVG? https://github.com/svg/svgo

export function toolDownloadSVGRender(selection: Selection<BaseType>, renderer: Renderer): void {
  selection
    .selectAll<HTMLLIElement, any>('.tool-download-svg')
    .data([null])
    .join('li')
    .classed('tool-download-svg', true)
    .text('Download SVG')
    .on('click', function () {
      select(this.closest('.window-rv'))
        .selectAll<SVGSVGElement, unknown>('.layouter > svg.chart')
        .call((s) => chartDownload(s, 'chart.svg', renderer));
    });
}

export function chartDownload<Datum>(
  chartSelection: Selection<SVGSVGElement, Datum>,
  fileName: string | ValueFn<SVGSVGElement, Datum, string>,
  renderer: Renderer
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


    applyDownloadStyle(g[i], clonedChart, renderer)

    //TODO: Maybe include decimals in settings
    roundSVGAttributes(select(clonedChart), 1)

    const cloneContainer = document.createElement('div');
    cloneContainer.append(clonedChart);

    const { downloadStyleType, downloadRemoveClasses,
      downloadRemoveDataKeys, downloadRemoveDataStyles } = renderer.windowSelection.datum().windowSettings

    //prev regex / (layout|bounds|data-ignore-layout|data-ignore-layout-children)=".*?"/g
    const classString =  (downloadStyleType === 'inline' && downloadRemoveClasses) ? '|class' : ''
    const dataKeyString =  (downloadRemoveDataKeys) ? '|data-key' : ''
    const dataStyleString =  (downloadStyleType === 'inline' && downloadRemoveDataStyles) ? '|data-style' : ''
    const optionalAttrs = classString + dataKeyString + dataStyleString
    const regex = new RegExp(`(layout|bounds|data-ignore-layout|data-ignore-layout-children${optionalAttrs})=".*?"`, 'g')

    const cloneHTML = cloneContainer.innerHTML.replace(regex, '')
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
