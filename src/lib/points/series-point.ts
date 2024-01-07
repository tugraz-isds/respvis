import {easeCubicOut, select, Selection} from 'd3';
import {SeriesConfigTooltips, seriesConfigTooltipsData, seriesConfigTooltipsHandleEvents,} from '../tooltip';
import {
  arrayIs,
  AxisValid,
  Circle,
  circleMinimized,
  circleToAttrs,
  rectFromString,
  ScaleAny,
  ScaleContinuous
} from '../core';
import {Size} from '../core/utilities/size';

export interface Point extends Circle {
  xValue: any;
  yValue: any;
  radiusValue?: any;
  styleClass: string;
  key: string;
}

export type SeriesPointArgs = Partial<SeriesConfigTooltips<SVGCircleElement, Point>> & {
  x: AxisValid,
  y: AxisValid,
  radiuses?: number | {
    radiusDim: number[],
    scale: ScaleAny<any, number, number>
  };
  color?: {
    colorDim: number[],
    colorScale: ScaleContinuous<any, string>
  };
  key: string
  styleClasses?: string | string[];
  labels?: string[]
  bounds?: Size;
  flipped?: boolean;
}

export type SeriesPointValid = Omit<SeriesPointArgs, 'radiuses'> & {
  radiuses: number | {
    radiusDim: number[],
    scale: ScaleAny<any, number, number>
  };
}

export function seriesPointData(data: SeriesPointArgs): SeriesPointValid {
  const {x, y, radiuses, key} = data
  const labels = data.labels

  //TODO: Do clean radius validation
  const radiusesValid = typeof radiuses === "number" ? radiuses : typeof radiuses === "object" ? {
    scale: radiuses.scale,
    radiusDim: radiuses.radiusDim
  } : 5

  return {x, y,
    radiuses: radiusesValid,
    color: data.color,
    styleClasses: data.styleClasses || 'categorical-0',
    key,
    labels,
    bounds: data.bounds || { width: 600, height: 400 },
    flipped: data.flipped || false,
    ...seriesConfigTooltipsData(data), //TODO: fix tooltips for all charts
  };
}

export function seriesPointCreatePoints(seriesData: SeriesPointValid): Point[] {
  const { x, y, radiuses, bounds,
    key: seriesKey, styleClasses, flipped,
    color, labels } =
    seriesData;

  const data: Point[] = [];

  for (let i = 0; i < x.values.length; ++i) {
    const xVal = x.values[i]
    const yVal = y.values[i]
    const category = x.categories[i]
    const r = typeof radiuses === "number" ? radiuses : radiuses.scale(radiuses.radiusDim[i]);
    const key = `s-${seriesKey} c-${x.categoryOrder[category]} i-${i}`
    data.push({
      label: labels?.[i],
      styleClass: arrayIs(styleClasses) ? styleClasses[i] : styleClasses,
      key,
      center: {
        x: flipped ? y.scale(yVal)! : x.scale(xVal)!,
        y: flipped ? x.scale(xVal)! : y.scale(yVal)!,
      },
      radius: r ?? 5,
      xValue: xVal,
      yValue: yVal,
      color: color?.colorScale(color.colorDim[i]),
      radiusValue: typeof radiuses !== "number" ? radiuses.radiusDim[i] : undefined
    });
  }

  return data;
}

export function seriesPointRender(selection: Selection<Element, SeriesPointValid>): void {
  selection
    .classed('series-point', true)
    .attr('data-ignore-layout-children', true)
    .each((d, i, g) => {
      const seriesS = select<Element, SeriesPointValid>(g[i]);
      const boundsAttr = seriesS.attr('bounds');
      if (!boundsAttr) return;
      d.bounds = rectFromString(boundsAttr);
      seriesS
        .selectAll<SVGCircleElement, Point>('.point')
        .data(seriesPointCreatePoints(d), (d) => d.key)
        .call((s) => seriesPointJoin(seriesS, s));
    })
    .on('pointerover.seriespointhighlight pointerout.seriespointhighlight', (e: PointerEvent) =>
      (<Element>e.target).classList.toggle('highlight', e.type.endsWith('over'))
    )
    .call((s) => seriesConfigTooltipsHandleEvents(s));
}

export function seriesPointJoin(
  seriesSelection: Selection,
  joinSelection: Selection<Element, Point>
): void {
  joinSelection
    .join(
      (enter) =>
        enter
          .append('circle')
          .classed('point', true)
          .each((d, i, g) => circleToAttrs(select(g[i]), circleMinimized(d)))
          .call((s) => seriesSelection.dispatch('enter', { detail: { selection: s } })),
      undefined,
      (exit) =>
        exit
          .classed('exiting', true)
          .call((s) =>
            s
              .transition('exit')
              .duration(250)
              .each((d, i, g) => circleToAttrs(select(g[i]), circleMinimized(d)))
              .remove()
          )
          .call((s) => seriesSelection.dispatch('exit', { detail: { selection: s } }))
    )
    .call((s) =>
      s
        .transition('update')
        .duration(250)
        .ease(easeCubicOut)
        .each((d, i, g) => circleToAttrs(select(g[i]), d))
    )
    .attr('data-style', (d) => !d.color ? d.styleClass : null)
    .attr('data-key', (d) => d.key)
    .call((s) => seriesSelection.dispatch('update', { detail: { selection: s } }));
}
