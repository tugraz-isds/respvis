import {Selection} from "d3";
import {Renderer} from "../../chart/renderer";
import {renderTool} from "../tool/render/render-tool";
import {addRawSVGToSelection} from "../../../utilities/d3/util";
import crossSVGRaw from "../../../../../assets/svg/movable-cross.svg";
import {renderButton} from "../tool/render/render-button";
import {renderSimpleTooltip} from "../tool/render/render-simple-tooltip";
import {clickSAddEnterExitAttributes} from "../tool/animation/animtation";

export function renderCrossTool(toolbarS: Selection<HTMLDivElement>, renderer: Renderer) {
  const contentS = toolbarS.selectAll<HTMLDivElement, any>('.toolbar__content')
  const downloadToolS = renderTool(contentS, 'tool--cross')
  const crossActivatorS = renderButton(downloadToolS, 'toolbar__btn')
  addRawSVGToSelection(crossActivatorS, crossSVGRaw)
  renderSimpleTooltip(crossActivatorS, {text: 'Inspect Chart'})
  clickSAddEnterExitAttributes(crossActivatorS, crossActivatorS, 600)
  crossActivatorS.on('click.settings', () => {
    const settings = renderer.windowS.datum().windowSettings
    settings.movableCrossActive = !settings.movableCrossActive
    renderer.windowS.dispatch('resize')
  })
}
