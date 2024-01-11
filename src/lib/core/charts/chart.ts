import {Selection} from "d3";
import {ChartWindowValid} from "../chart-window";
import {ChartBaseValid} from "./chart-base";

type ChartValid = ChartWindowValid & ChartBaseValid
export abstract class Chart {
  private addedListeners = false
  constructor(public selection: Selection<HTMLDivElement, ChartValid>) {}

  buildChart() {
    this.render()
    if (this.addedListeners) return
    this.addBuiltInListeners()
    this.addedListeners = true
    this.addFinalListeners()
  }

  /**
   * Adds custom event listener. Be sure to add custom event listeners before calling {@link Chart.buildChart}
   * as the method also adds listeners and the order matters.
   */
  addCustomListener<T extends ChartValid>(name: string, callback: (event: Event, data: T) => void) {
    this.selection.on(name, callback)
  }

  private addFinalListeners() {
    const instance = this
    this.selection.on('resize.final', () => {
      instance.render()
    });
  }

  protected abstract addBuiltInListeners(): void
  protected abstract render(): void
}
