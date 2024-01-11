import {select, Selection} from 'd3';
import {AxisArgs, axisBottomRender, axisData, axisLeftRender, AxisPropagation, AxisValid, syncAxes} from "../../axes";
import {ChartBaseArgs, ChartBaseValid, chartBaseValidation} from "../chart-base";
import {validateZoom, ZoomArgs, ZoomValid} from "../../utilities/zoom";
import {legendData, LegendValid} from "../../../legend";

export type ChartCartesianArgs = ChartBaseArgs & {
  x: AxisArgs,
  y: AxisArgs,
  flipped?: boolean;
  zoom?: ZoomArgs
  styleClasses?: string[]
  legend?: LegendValid
}

export type ChartCartesianValid = ChartBaseValid & { //TODO: what about styleClasses?
  x: AxisValid,
  y: AxisValid,
  flipped: boolean;
  zoom?: ZoomValid
  legend: LegendValid;
}

export function chartCartesianData(data: ChartCartesianArgs): ChartCartesianValid {
  const {
    legend, flipped, zoom
  } = data
  const [x, y] = syncAxes(axisData(data.x), axisData(data.y))
  const styleClasses = data.styleClasses ? data.styleClasses :
    x.categories.map((category) => `categorical-${x.categoryOrder[category]}`)
  const labels = legend?.labels ? legend.labels : x.categories

  const categories = Object.keys(x.categoryOrder)
  const legendValid = legendData({
    ...(legend ? legend : {}),
    labels: legend?.labels ? legend.labels : categories,
    keys: categories.map((_, i) => `s-0 c-${i}`)
  })

  return {
    flipped: flipped || false,
    x,
    y,
    ...chartBaseValidation(data),
    legend: legendValid,
    zoom: zoom ? validateZoom(zoom) : undefined
  };
}

export type ChartCartesianSelection = Selection<SVGSVGElement | SVGGElement, ChartCartesianValid>;

export function chartCartesianAxisRender<T extends ChartCartesianSelection>(selection: T): void {
  selection
    .classed('chart-cartesian', true)
    .each(function ({flipped, x, y, selection}, i, g) {
      const s = <ChartCartesianSelection>select(g[i]);
      const flippedBool = flipped ? flipped : false

      s.selectAll<SVGGElement, AxisPropagation>('.axis-left')
        .data([{...(flipped ? x : y), selection}])
        .join('g')
        .call((s) => axisLeftRender(s))
        .classed('axis-x', flippedBool)
        .classed('axis-y', !flipped);

      s.selectAll<SVGGElement, AxisValid>('.axis-bottom')
        .data([{...(flipped ? y : x), selection}])
        .join('g')
        .call((s) => axisBottomRender(s))
        .classed('axis-x', !flipped)
        .classed('axis-y', flippedBool);
    })
    .attr('data-flipped', (d) => d.flipped ? d.flipped : false);
}

export enum LegendPosition {
  Top = 'top',
  Right = 'right',
  Bottom = 'bottom',
  Left = 'left',
}

export function chartLegendPosition(
  chartSelection: Selection<SVGSVGElement | SVGGElement>,
  position: LegendPosition
): void {
  chartSelection.attr('data-legend-position', position);
}
