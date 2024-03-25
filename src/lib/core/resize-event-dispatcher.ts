import {select, Selection} from 'd3';
import {Rect} from './utilities/rect';

export type ResizeEvent = CustomEvent<{ bounds: Rect }>;

export function resizeEventListener(observeS: Selection<Element>, dispatchS?: Selection<Element>) {
  const resizeEventDispatcher = new ResizeObserver((entries) => {
    // console.log("RESIZE", entries)
    for (let i = 0; i < entries.length; i++) {
      const finalDispatchS = dispatchS ? dispatchS : select(entries[i].target)
      finalDispatchS.dispatch('resize', {
        detail: { bounds: entries[i].target.getBoundingClientRect() }})
      if (dispatchS) return;
    }
  });
  observeS.each((d, i, g) => resizeEventDispatcher.observe(g[i]));
  return resizeEventDispatcher
}
