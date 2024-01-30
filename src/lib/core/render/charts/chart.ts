import {Selection} from "d3";
import {SVGHTMLElement} from "../../constants/types";
import {ChartWindowArgs, ChartWindowValid, validateChartWindow} from "../chart-window";
import {ChartBaseValid} from "./chart-base";
import {Renderer} from "./renderer";
import {resizeEventListener} from "../../resize-event-dispatcher";
import {throttle} from "../../utilities/d3/util";

type ChartValid = ChartWindowValid & ChartBaseValid

export abstract class Chart implements Renderer {
  private addedListeners = false
  protected initialRenderHappened = false
  abstract windowSelection: Selection<SVGHTMLElement, ChartValid>
  protected readonly initialWindowData: ChartWindowValid
  chartSelection?: Selection<SVGHTMLElement>
  drawAreaSelection?: Selection<SVGHTMLElement>
  xAxisSelection?: Selection<SVGHTMLElement>
  yAxisSelection?: Selection<SVGHTMLElement>
  legendSelection?: Selection<SVGHTMLElement>

  protected constructor(data: Omit<ChartWindowArgs, 'renderer'>) {
    this.initialWindowData = validateChartWindow({...data, renderer: this})
  }


  buildChart() {
    this.render()
    this.initialRenderHappened = true
    if (this.addedListeners) return
    this.addBuiltInListeners()
    this.addedListeners = true
    this.addFinalListeners()
  }

  /**
   * Adds custom event listener. Be sure to add custom event listeners before calling {@link this.buildChart}
   * as the method also adds listeners and the order matters.
   */
  addCustomListener<T extends ChartValid>(name: string, callback: (event: Event, data: T) => void) {
    this.windowSelection.on(name, callback)
  }

  private addFinalListeners() {
    const instance = this
    resizeEventListener(this.windowSelection)
    const rerender = () => instance.render()
    const throttledRerender = throttle(rerender, 50)
    this.windowSelection.on('resize.final', rerender)
  }

  protected abstract addBuiltInListeners(): void
  protected abstract render(): void
}
