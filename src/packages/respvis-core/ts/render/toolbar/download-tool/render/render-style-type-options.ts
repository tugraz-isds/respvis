import {Selection} from "d3";
import {Renderer} from "../../../chart/renderer";
import {windowSettingsKeys} from "../../../window/window-settings";
import {uniqueId} from "../../../../utilities/unique";
import {RadioLabel} from "../../tool/input-label/radio-label";
import {renderFieldset} from "../../tool/render/render-fieldset";

export function renderStyleTypeOptions(selection: Selection, renderer: Renderer) {
  const currentSettings = renderer.windowS.datum().settings.state
  const onChange = (e: InputEvent, type: string) => {
    currentSettings[type] = (e.target as HTMLInputElement).value
    renderer.windowS.dispatch('resize')
  }
  const sharedData = {
    defaultVal: currentSettings.downloadStyleType,
    type: windowSettingsKeys.downloadStyleType,
    name: uniqueId(),
    onChange,
  }
  const data = [{
    legend: 'Style Type',
    labelData: [
      new RadioLabel({...sharedData, value: 'inline', label: 'Inline CSS (styles in elements)'}),
      new RadioLabel({...sharedData,
        value: 'embedded', label: 'Embedded CSS (styles in style block)'
        , info: 'Success of this method is not guaranteed.'
      }),
    ]
  }]
  return renderFieldset(selection, data, 'item', 'item--radio')
}
