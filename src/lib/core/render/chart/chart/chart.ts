import {Selection} from "d3";
import {SVGHTMLElement} from "../../../constants/types";
import {WindowArgs, windowRender, WindowValid, windowValidation} from "../../window";
import {ChartValid} from "./chart-validation";
import {Renderer} from "../renderer";
import {resizeEventListener} from "../../../resize-event-dispatcher";
import {layouterCompute} from "../../../layouter";
import {chartRender} from "./chart-render";

export type ChartWindowedValid = WindowValid & ChartValid

export abstract class Chart implements Renderer {
  private addedListeners = false
  protected initialRenderHappened = false
  abstract windowSelection: Selection<SVGHTMLElement, ChartWindowedValid>
  protected readonly initialWindowData: WindowValid
  protected renderCountSinceResize = 0
  protected renderInitialized?: NodeJS.Timeout
  chartSelection?: Selection<SVGSVGElement, ChartWindowedValid>
  drawAreaSelection?: Selection<SVGHTMLElement>
  layouterSelection?: Selection<HTMLDivElement>
  xAxisSelection?: Selection<SVGHTMLElement>
  yAxisSelection?: Selection<SVGHTMLElement>
  legendSelection?: Selection<SVGHTMLElement>

  protected constructor(data: Omit<WindowArgs, 'renderer'>) {
    this.initialWindowData = windowValidation({...data, renderer: this})
  }


  buildChart() {
    this.render()
    if (this.addedListeners) return
    this.addBuiltInListeners()
    this.addFinalListeners()
    this.addedListeners = true
    this.render()
  }

  /**
   * Adds custom event listener. Be sure to add custom event listeners before calling {@link Chart.buildChart}
   * as the method also adds listeners and the order matters.
   */
  addCustomListener<T extends ChartWindowedValid>(name: string, callback: (event: Event, data: T) => void) {
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

  private initializeRender() {
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

  protected render() {
    this.preRender()
    this.mainRender()
    this.postRender()
    this.initialRenderHappened = true
  }

  protected preRender() {}

  protected mainRender() {
    const data = this.windowSelection.datum()
    windowRender(this.windowSelection)
    chartRender(this.chartSelection!).chartS
      .classed(`chart-${data.type}`, true)
  }

  protected postRender() {
    if (this.layouterSelection) {
      const boundsChanged = layouterCompute(this.layouterSelection)
      if (boundsChanged) this.initializeRender()
    }
  }
}
