import {select, Selection, ValueFn} from 'd3';
import {optimizeSVG} from "./optimize-svg";
import {Renderer} from "../../../chart/renderer";
import {applyDownloadStyle} from "./apply-download-style/apply-download-style";
import {prettifySVG} from "./prettify-svg";

export function downloadChart<Datum>(
  chartSelection: Selection<SVGSVGElement, Datum>,
  fileName: string | ValueFn<SVGSVGElement, Datum, string>,
  renderer: Renderer
): void {
  chartSelection.each((d, i, g) => {
    const {
      downloadStyleType, downloadRemoveClasses,
      downloadRemoveDataKeys, downloadRemoveDataStyles,
      downloadMarginLeft, downloadMarginTop,
      downloadMarginRight, downloadMarginBottom
    } = renderer.windowS.datum().settings.state

    const clonedChart = <SVGSVGElement>g[i].cloneNode(true);
    const width = clonedChart.getAttribute('width');
    const height = clonedChart.getAttribute('height');
    const finalX = `${0 - parseInt(downloadMarginLeft)}`
    const finalY = `${0 - parseInt(downloadMarginTop)}`
    const finalWidth = `${parseInt(width ?? '0') + parseInt(downloadMarginLeft) + parseInt(downloadMarginRight)}`
    const finalHeight = `${parseInt(height ?? '0') + parseInt(downloadMarginTop) + parseInt(downloadMarginBottom)}`
    clonedChart.setAttribute('viewBox', `${finalX}, ${finalY}, ${finalWidth}, ${finalHeight}`);
    clonedChart.removeAttribute('width');
    clonedChart.removeAttribute('height');
    clonedChart.removeAttribute('x');
    clonedChart.removeAttribute('y');


    applyDownloadStyle(g[i], clonedChart, renderer)

    optimizeSVG(select(clonedChart), renderer)

    const cloneContainer = document.createElement('div');
    cloneContainer.append(clonedChart);

    //prev regex / (layout|bounds|data-ignore-layout|data-ignore-layout-children)=".*?"/g
    const classString = (downloadStyleType === 'inline' && downloadRemoveClasses) ? '|class' : ''
    const dataKeyString = (downloadRemoveDataKeys) ? '|data-key' : ''
    const dataStyleString = (downloadStyleType === 'inline' && downloadRemoveDataStyles) ? '|data-style' : ''
    const optionalAttrs = classString + dataKeyString + dataStyleString
    const regex = new RegExp(`\\s(layout|bounds|data-ignore-layout|data-ignore-layout-children${optionalAttrs})=".*?"`, 'g')

    let cloneHTML = cloneContainer.innerHTML.replace(regex, '')
    cloneHTML = prettifySVG(cloneHTML, renderer)
    const blobType = 'image/svg+xml;charset=utf-8';
    const blob = new Blob([cloneHTML], {type: blobType});
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
