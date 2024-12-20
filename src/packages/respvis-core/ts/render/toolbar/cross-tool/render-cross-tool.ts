import {Selection} from "d3";
import {renderTool} from "../tool/render/render-tool";
import crossSVGRaw from "../../../../../../assets/svg/tablericons/movable-cross.svg";
import {renderButton} from "../tool/render/render-button";
import {renderSimpleTooltip} from "../tool/render/render-simple-tooltip";
import {clickSAddEnterExitAttributes} from "../tool/animation/animtation";
import {renderMovableCrossTooltip} from "respvis-tooltip";
import {DataSeries} from "../../data-series";
import {renderSVGSeries} from "../../element";

export function renderCrossTool(toolbarS: Selection<HTMLDivElement>, seriesCollection: DataSeries[]) {
  if (seriesCollection.length <= 0) return
  const renderer = seriesCollection[0].renderer
  const contentS = toolbarS.selectAll<HTMLDivElement, any>('.toolbar__content')
  const crossToolS = renderTool(contentS, 'tool--cross')
  const crossActivatorS = renderButton(crossToolS, 'toolbar__btn')
  renderSVGSeries(crossActivatorS, [crossSVGRaw])
  renderSimpleTooltip(crossActivatorS, {text: 'Inspect Chart'})
  clickSAddEnterExitAttributes(crossActivatorS, crossActivatorS, 600)
  crossActivatorS.on('click.settings', () => {
    const settings = renderer.windowS.datum().settings.state
    settings.movableCrossActive = !settings.movableCrossActive
    renderer.windowS.dispatch('resize')
  })
  seriesCollection.forEach(series => renderMovableCrossTooltip(series))
}
