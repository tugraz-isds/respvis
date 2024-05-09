import {Selection} from "d3";
import {Renderer} from "../../chart/renderer";
import {toolRender} from "../tool/tool-render";
import {addRawSVGToSelection} from "../../../utilities/d3/util";
import crossSVGRaw from "../../../assets/movable-cross.svg";
import {buttonRender} from "../tool/button-render";
import {tooltipSimpleRender} from "../tool/tooltip-simple-render";
import {clickSAddEnterExitAttributes} from "../tool/animation/animtation";

export function crossToolRender(toolbarS: Selection<HTMLDivElement>, renderer: Renderer) {
  const contentS = toolbarS.selectAll<HTMLDivElement, any>('.toolbar__content')
  const downloadToolS = toolRender(contentS, 'tool--cross')
  const crossActivatorS = buttonRender(downloadToolS, 'toolbar__btn')
  addRawSVGToSelection(crossActivatorS, crossSVGRaw)
  tooltipSimpleRender(crossActivatorS, {text: 'Inspect Chart'})
  clickSAddEnterExitAttributes(crossActivatorS, crossActivatorS, 600)
  crossActivatorS.on('click.settings', () => {
    const settings = renderer.windowS.datum().windowSettings
    settings.movableCrossActive = !settings.movableCrossActive
    renderer.windowS.dispatch('resize')
  })
}
