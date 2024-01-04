import {AxisDomain, AxisScale, easeCubicOut, select, Selection} from 'd3';
import {SeriesConfigTooltips, seriesConfigTooltipsData, seriesConfigTooltipsHandleEvents,} from '../tooltip';
import {
  arrayIs,
  calcDefaultScale,
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

export interface SeriesPoint extends SeriesConfigTooltips<SVGCircleElement, Point> {
  xValues: any[];
  xScale: AxisScale<AxisDomain>,
  yValues: any[];
  yScale: AxisScale<AxisDomain>,
  radiuses: number | {
    radiusDim: number[],
    scale: ScaleAny<any, number, number>
  };
  color?: {
    colorDim: number[],
    colorScale: ScaleContinuous<any, string>
  };
  styleClasses: string | string[];
  keys: string[];
  bounds: Size;
  flipped: boolean;
}

export function seriesPointData(data: Partial<SeriesPoint>): SeriesPoint {
  const xValues = data.xValues || [];
  const yValues = data.yValues || [];

  let xScale = data.xScale || calcDefaultScale(xValues)
  let yScale = data.yScale || calcDefaultScale(xValues)

  const keys = data.keys || yValues.map((c, i) => i.toString());

  return {
    xValues,
    xScale,
    yValues,
    yScale,
    radiuses: data.radiuses || 5,
    color: data.color,
    styleClasses: data.styleClasses || 'categorical-0',
    keys,
    bounds: data.bounds || { width: 600, height: 400 },
    flipped: data.flipped || false,
    ...seriesConfigTooltipsData(data),
    tooltipsEnabled: data.tooltipsEnabled || true,
    tooltips: data.tooltips || ((e, d) => `X-Value: ${d.xValue}<br/>Y-Value: ${d.yValue}`),
  };
}

export function seriesPointCreatePoints(seriesData: SeriesPoint): Point[] {
  const { xScale, yScale, xValues, yValues, radiuses, bounds, keys, styleClasses, flipped, color } =
    seriesData;

  const data: Point[] = [];

  for (let i = 0; i < xValues.length; ++i) {
    const x = xValues[i]
    const y = yValues[i]
    const r = typeof radiuses === "number" ? radiuses : radiuses.scale(radiuses.radiusDim[i]);
    const radiusValue =
    data.push({
      styleClass: arrayIs(styleClasses) ? styleClasses[i] : styleClasses,
      key: keys?.[i] || i.toString(),
      center: {
        x: flipped ? yScale(y)! : xScale(x)!,
        y: flipped ? xScale(x)! : yScale(y)!,
      },
      radius: r ?? 5,
      xValue: x,
      yValue: y,
      color: color?.colorScale(color.colorDim[i]),
      radiusValue: typeof radiuses !== "number" ? radiuses.radiusDim[i] : undefined
    });
  }

  return data;
}

export function seriesPointRender(selection: Selection<Element, SeriesPoint>): void {
  selection
    .classed('series-point', true)
    .attr('data-ignore-layout-children', true)
    .each((d, i, g) => {
      const seriesS = select<Element, SeriesPoint>(g[i]);
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
