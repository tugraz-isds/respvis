import {SeriesResponsiveState, SeriesResponsiveStateArgs} from "../../core/render/series/responsive-state";
import {ParcoordSeries} from "./parcoord-series";

type ParcoordSeriesResponsiveStateArgs = SeriesResponsiveStateArgs & {
  series: ParcoordSeries
}

export class ParcoordSeriesResponsiveState extends SeriesResponsiveState {
  series: ParcoordSeries

  constructor(args: ParcoordSeriesResponsiveStateArgs) {
    super(args);
    this.series = args.series
  }
  update() {
    super.update();
    const {horizontal, vertical} = this.drawAreaRange()
    const currentSingleAxisRange = this.currentlyFlipped ? horizontal : vertical
    const currentAxesSpaceRange = this.currentlyFlipped ? vertical : horizontal

    const {axes, axesScale, percentageScreenScale} = this.series
    axes.forEach(axis => axis.scaledValues.scale.range(currentSingleAxisRange))
    percentageScreenScale.range(currentAxesSpaceRange)
    axesScale.range(currentAxesSpaceRange)
  }
}
