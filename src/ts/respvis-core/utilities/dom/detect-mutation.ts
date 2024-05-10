import {Selection} from "d3";
import {elementFromSelection} from "../d3/util";

export function detectClassChange(selection: Selection<Element>, onClassChange: () => void) {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        onClassChange()
      }
    }
  })
  const config = { attributes: true, attributeFilter: ['class'] };
  if (selection.empty()) return undefined
  observer.observe(elementFromSelection(selection), config);
  return {observer}
}
