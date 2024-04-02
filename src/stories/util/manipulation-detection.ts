import {Selection} from "d3";

export function detectManipulation(selection: Selection) {
  const elements: Element[] = []
  const observer = new MutationObserver(function(mutations) {
    for (const mutation of mutations) {
      for (let i = 0; i < mutation.removedNodes.length; i++) {
        elements.forEach(element => {
          if (element === mutation.removedNodes.item(i)) {
            observer.disconnect();
            selection.dispatch('manipulation')
          }
        })
      }
    }
  });
  selection.each((d, i, g) => {
    const parent = (g[i] as Node).parentNode as Element
    elements.push(g[i] as Element)
    observer.observe(parent, {
      childList: true, // Do not observe additions/removals of child nodes
      subtree: false, // Do not observe changes in the entire subtree of the target node
      attributes: false, // Do not observe attribute changes
      characterData: false // Do not observe changes to character data within the target node
    });
  })
}

export function reloadOnManipulation(selection: Selection) {
  detectManipulation(selection)
  selection.on('manipulation', () => {
    location.reload()
  })
}
