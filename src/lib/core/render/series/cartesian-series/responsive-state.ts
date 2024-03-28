import {SeriesResponsiveState, SeriesResponsiveStateArgs} from "../responsive-state";
import {CartesianSeries} from "./cartesian-series";

type CartesianSeriesResponsiveStateArgs = SeriesResponsiveStateArgs & {
  series: CartesianSeries
}

export class CartesianSeriesResponsiveState extends SeriesResponsiveState {
  series: CartesianSeries

  constructor(args: CartesianSeriesResponsiveStateArgs) {
    super(args);
    this.series = args.series
  }
  update() {
    super.update();
    const {horizontal, vertical} = this.drawAreaRange()
    const currentYRange = this.currentlyFlipped ? horizontal : vertical
    const currentXRange = this.currentlyFlipped ? vertical : horizontal
    this.series.x.scale.range(currentXRange)
    this.series.y.scale.range(currentYRange)
  }
}
