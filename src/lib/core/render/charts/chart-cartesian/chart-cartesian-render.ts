import {select, Selection} from "d3";
import {axisBottomRender, axisLeftRender, AxisSelection, AxisValid} from "../../axis";
import {ChartCartesianSelection} from "./chart-cartesian-validation";

export function chartCartesianAxisRender<T extends ChartCartesianSelection>(chartS: T): void {
  // const seriesS = select<Element, SeriesBar>(g[i]);
  // const boundsAttr = seriesS.attr('bounds');
  // if (!boundsAttr) return;
  // d.bounds = rectFromString(boundsAttr);

  // if (!flipped) {
  //   categoryScale.range([0, bounds.width]);
  //   valueScale.range([bounds.height, 0]);
  // } else {
  //   categoryScale.range([0, bounds.height]);
  //   valueScale.range([0, bounds.width]);
  // }


  chartS
    .classed('chart-cartesian', true)
    .each(function ({flipped, x, y, selection, renderer}, i, g) {
      const s = <ChartCartesianSelection>select(g[i]);
      const flippedBool = flipped ? flipped : false

      renderer.yAxisSelection = s.selectAll<SVGGElement, AxisSelection>('.axis-left')
        .data([{...(flipped ? x : y), selection}])
        .join('g')
        .call((s) => axisLeftRender(s))
        .classed('axis-x', flippedBool)
        .classed('axis-y', !flipped)

      renderer.xAxisSelection = s.selectAll<SVGGElement, AxisValid>('.axis-bottom')
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
