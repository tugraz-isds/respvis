import {Selection} from "d3";
import {Renderer} from "../../chart/renderer";
import {toolRender} from "../tool/tool-render";
import {addRawSVGToSelection} from "../../../utilities/d3/util";
import crossSVGRaw from "../../../assets/movable-cross.svg";
import {buttonAddEnterExitAttributes, buttonRender} from "../tool/button-render";

export function crossToolRender(selection: Selection<HTMLDivElement>, renderer: Renderer) {
  const downloadToolS = toolRender(selection, 'tool--cross')
  const crossActivatorS = buttonRender(downloadToolS, 'toolbar__btn')
  addRawSVGToSelection(crossActivatorS, crossSVGRaw)
  buttonAddEnterExitAttributes(crossActivatorS)
  crossActivatorS.on('click.settings', () => {
    const settings = renderer.windowSelection.datum().windowSettings
    settings.movableCrossActive = !settings.movableCrossActive
    renderer.windowSelection.dispatch('resize')
  })
}
