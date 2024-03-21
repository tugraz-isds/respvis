import {select, Selection} from 'd3';
import {Rect} from './utilities/rect';

export type ResizeEvent = CustomEvent<{ bounds: Rect }>;

export function resizeEventListener(selection: Selection<Element>) {
  const resizeEventDispatcher = new ResizeObserver((entries) => {
    entries.forEach((entry) =>
      select(entry.target).dispatch('resize', {
        detail: { bounds: entry.target.getBoundingClientRect() },
      })
    );
  });
  selection.each((d, i, g) => resizeEventDispatcher.observe(g[i]));
  return resizeEventDispatcher
}
