import {select, Selection} from 'd3';

export type ReRenderContext = {
  type: 'resize' | 'standard-interaction' | 'immediate-interaction',
  throttleMs: number
}

export function resizeEventListener(observeS: Selection<Element>, dispatchS?: Selection<Element>) {
  const resizeEventDispatcher = new ResizeObserver((entries) => {
    for (let i = 0; i < entries.length; i++) {
      const finalDispatchS = dispatchS ? dispatchS : select(entries[i].target)
      finalDispatchS.dispatch('resize', {
        detail: { bounds: entries[i].target.getBoundingClientRect(), type: 'resize' }})
      if (dispatchS) return;
    }
  });
  observeS.each((d, i, g) => {
    resizeEventDispatcher.observe(g[i])
  });
  return resizeEventDispatcher
}
