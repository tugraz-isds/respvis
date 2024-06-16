import {Selection} from "d3";
import {Point} from "../point";
import {joinPointSeries} from "./join-point-series";

export function renderPoints(seriesS: Selection, points: Point[]) {
  seriesS.selectAll<SVGCircleElement, Point>('.point')
    .data(points, (d) => d.key)
    .call((s) => joinPointSeries(seriesS, s));
  return seriesS
}

