import {Selection} from "d3";
import {axisBottomRender, axisLeftRender, AxisSelection, AxisValid} from "../../axis";
import {ChartCartesianSelection} from "./chart-cartesian-validation";
import {getCurrentRespVal} from "../../../data/responsive-value/responsive-value";
import {elementFromSelection} from "../../../utilities/d3/util";

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
  const {renderer, ...data} = chartS.datum()
  const flipped = getCurrentRespVal(data.flipped, {chart: elementFromSelection(chartS)})
  const leftAxisD = flipped ? data.x : data.y
  const leftAxisClass = flipped ? 'axis-x' : 'axis-y'
  const bottomAxisD = flipped ? data.y : data.x
  const bottomAxisClass = flipped ? 'axis-y' : 'axis-x'
  // console.log('Range', leftAxisD.scale.range())
  // console.log('Domain', leftAxisD.scale.domain())

  // console.log(flipped)
  chartS.classed('chart-cartesian', true)
    .attr('data-flipped', flipped)

  const leftAxisS= chartS.selectAll<SVGGElement, AxisSelection>('.axis-left')
    .data([leftAxisD])
    .join('g')
    .call((s) => axisLeftRender(s))
    .classed(leftAxisClass, true)

  const bottomAxisS = chartS.selectAll<SVGGElement, AxisValid>('.axis-bottom')
    .data([bottomAxisD])
    .join('g')
    .call((s) => axisBottomRender(s))
    .classed(bottomAxisClass, true)

  renderer.yAxisSelection = flipped ? bottomAxisS: leftAxisS
  renderer.xAxisSelection = flipped ? leftAxisS : bottomAxisS
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
