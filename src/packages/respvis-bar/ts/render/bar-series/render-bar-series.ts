import {Selection} from "d3";
import {BarSeries} from "./bar-series";
import {BarArgs} from "../bar";
import {joinBarSeries} from "./join-bar-series";
import {BarStandardSeries} from "./bar-base/bar-standard-series";
import {createSelectionClasses, SVGGroupingElement} from "respvis-core";

export function renderBarSeries(parentS: Selection<SVGGroupingElement>, series: BarSeries[], ...classes: string[]) {
  const {classString, selector} = createSelectionClasses(classes)

  const seriesS = parentS.selectAll<SVGGElement, BarStandardSeries>(`${selector}.series-bar`)
    .data(series)
    .join('g')
    .classed(`${classString} series-bar`, true)

  const barS = seriesS.selectAll<SVGRectElement, BarArgs>('rect')
    .data(d => d.getBars(), (d) => d.key.rawKey)
    .call((s) => joinBarSeries(seriesS, s))

  return {seriesS, barS}
}
