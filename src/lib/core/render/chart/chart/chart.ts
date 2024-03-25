import {dispatch, Selection} from "d3";
import {SVGHTMLElement} from "../../../constants/types";
import {WindowArgs, windowRender, WindowValid, windowValidation} from "../../window";
import {ChartValid} from "./chart-validation";
import {Renderer} from "../renderer";
import {resizeEventListener} from "../../../resize-event-dispatcher";
import {layouterCompute} from "../../../layouter";
import {chartRender} from "./chart-render";
import {throttle} from "../../../utilities/d3/util";

export type ChartWindowedValid = WindowValid & ChartValid

export abstract class Chart implements Renderer {
  private addedListeners = false
  protected initialRenderHappened = false
  abstract windowSelection: Selection<SVGHTMLElement, ChartWindowedValid>
  public readonly filterDispatch = dispatch<{ dataKey: string }>('filter')
  protected readonly initialWindowData: WindowValid
  protected renderCountSinceResize = 0
  protected renderInitialized?: NodeJS.Timeout
  protected resizeObserver?: ResizeObserver
  private resizeThrottle?: ReturnType<typeof throttle>
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
    const chartDivS = this.layouterSelection?.selectChild('div.chart')
    if (chartDivS) this.resizeObserver = resizeEventListener(
      chartDivS as Selection<Element>, this.windowSelection)
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
    const rerender = () => {
      this.renderCountSinceResize = 0
      this.initializeRender()
    }
    if (!this.resizeThrottle) this.resizeThrottle = throttle(() => this.windowSelection.dispatch('resize'), 30)
    this.windowSelection.on('resize.final', () => rerender())
    //TODO: maybe add variant of throtteling which allows scheduling exactly one job?
    this.windowSelection.on('pointermove.final pointerleave.final pointerdown.final pointerup.final',
      () => this.resizeThrottle?.func())
  }

  protected addBuiltInListeners() {}

  private initializeRender() {
    clearTimeout(this.renderInitialized)
    const instance = this
    if (this.renderCountSinceResize > 2) {
      /* DEV_MODE_ONLY_START */
      console.log('TOO MANY RENDERS. THERE MUST BE A PROBLEM')
      /* DEV_MODE_ONLY_END */
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
    this.addFinalListeners()
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
