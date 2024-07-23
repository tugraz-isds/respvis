import {Selection} from "d3";
import {Point} from "../point";
import {joinPointSeries} from "./join-point-series";
import {createSelectionClasses, SVGGroupingElement} from "respvis-core";
import {createPoints} from "./create-points";
import {PointSeries} from "./point-series";

export function renderPointSeries(parentS: Selection<SVGGroupingElement>, series: PointSeries[], ...classes: string[]) {
  const {classString, selector} = createSelectionClasses(classes)

  const seriesS = parentS.selectAll<SVGSVGElement, PointSeries>(`${selector}.series-point`)
    .data<PointSeries>(series)
    .join('g')
    .classed(`${classString} series-point`, true)
    .attr('data-ignore-layout-children', true)

  const pointS = seriesS.selectAll<SVGCircleElement, Point>('.point')
    .data((d) => createPoints(d, false), (d) => d.key.rawKey)
    .call((s) => joinPointSeries(seriesS, s));

  return {seriesS, pointS}
}
