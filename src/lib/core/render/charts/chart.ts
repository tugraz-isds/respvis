import {Selection} from "d3";
import {SVGHTMLElement} from "../../constants/types";
import {ChartWindowArgs, ChartWindowValid, validateChartWindow} from "../chart-window";
import {ChartBaseValid} from "./chart-base";
import {Renderer} from "./renderer";
import {resizeEventListener} from "../../resize-event-dispatcher";

type ChartValid = ChartWindowValid & ChartBaseValid

export abstract class Chart implements Renderer {
  private addedListeners = false
  protected initialRenderHappened = false
  abstract windowSelection: Selection<SVGHTMLElement, ChartValid>
  protected readonly initialWindowData: ChartWindowValid
  protected renderCountSinceResize = 0
  protected renderInitialized? : NodeJS.Timeout
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
    const rerender = () => {
      // console.log('RERENDER!')
      instance.renderCountSinceResize = 0
      instance.initializeRender()
    }
    // const throttledRerender = throttle(rerender, 50)
    this.windowSelection.on('resize.final', rerender)
  }

  protected abstract addBuiltInListeners(): void

  protected initializeRender() {
    clearTimeout(this.renderInitialized)
    const instance = this
    if (this.renderCountSinceResize > 2) {
      //TODO: Use this only in production to protect users against infinite loop.
      //Use error message to detect this in dev mode!
      console.log('TOO MANY RENDERS. THERE MUST BE A PROBLEM')
      return
    }
    this.renderCountSinceResize++
    instance.render()
    // this.renderInitialized = setTimeout(() => {
    //   this.renderCountSinceResize++
    //   instance.render()
    // }, 20)
  }

  protected abstract render() : void
}
