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
  abstract windowS: Selection<SVGHTMLElement, ChartWindowedValid>
  public readonly filterDispatch = dispatch<{ dataKey: string }>('filter')
  protected readonly initialWindowData: WindowValid
  protected renderCountSinceResize = 0
  protected renderInitialized?: NodeJS.Timeout
  protected resizeObserver?: ResizeObserver
  private resizeThrottle?: ReturnType<typeof throttle>
  xAxisS?: Selection<SVGHTMLElement>
  yAxisS?: Selection<SVGHTMLElement>
  legendS?: Selection<SVGHTMLElement>

  protected constructor(data: Omit<WindowArgs, 'renderer'>) {
    this.initialWindowData = windowValidation({...data, renderer: this})
  }

  _layouterS?: Selection<HTMLDivElement>
  get layouterS(): Selection<HTMLDivElement> {
    return (this._layouterS && !this._layouterS.empty()) ? this._layouterS :
      this.windowS.selectAll<HTMLDivElement, any>('.layouter')
  }
  _chartS?: Selection<SVGSVGElement, ChartWindowedValid>
  get chartS(): Selection<SVGSVGElement, ChartWindowedValid> {
    return (this._chartS && !this._chartS.empty()) ? this._chartS :
      this.layouterS.selectAll<SVGSVGElement, ChartWindowedValid>('svg.chart')
  }
  _drawAreaS?: Selection<SVGHTMLElement>
  get drawAreaS(): Selection<SVGHTMLElement> {
    return (this._drawAreaS && !this._drawAreaS.empty()) ? this._drawAreaS :
      this.chartS.selectAll<SVGHTMLElement, any>('.draw-area')
  }
  _drawAreaBgS?: Selection<SVGRectElement>
  get drawAreaBgS(): Selection<SVGRectElement> {
    return (this._drawAreaBgS && !this._drawAreaBgS.empty()) ? this._drawAreaBgS :
      this.drawAreaS.selectChildren<SVGRectElement, any>('.background')
  }

  buildChart() {
    this.render()
    if (this.addedListeners) return
    this.addBuiltInListeners()
    const chartDivS = this.layouterS.selectChild('div.chart')
    if (chartDivS) this.resizeObserver = resizeEventListener(
      chartDivS as Selection<Element>, this.windowS)
    this.addedListeners = true
    this.render()
  }

  /**
   * Adds custom event listener. Be sure to add custom event listeners before calling {@link Chart.buildChart}
   * as the method also adds listeners and the order matters.
   */
  addCustomListener<T extends ChartWindowedValid>(name: string, callback: (event: Event, data: T) => void) {
    this.windowS.on(name, callback)
  }

  private addFinalListeners() {
    const rerender = () => {
      this.renderCountSinceResize = 0
      this.initializeRender()
    }
    if (!this.resizeThrottle) this.resizeThrottle = throttle(() => this.windowS.dispatch('resize'), 30)
    this.windowS.on('resize.final', () => rerender())
    //TODO: maybe add variant of throtteling which allows scheduling exactly one job?
    this.windowS.on('pointermove.final pointerleave.final pointerdown.final pointerup.final',
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
    if (!(this.windowS.node() as Element).isConnected) return
    this.preRender()
    this.mainRender()
    this.postRender()
    this.addFinalListeners()
    this.initialRenderHappened = true
  }

  protected preRender() {}

  protected mainRender() {
    const data = this.windowS.datum()
    const {chartS} = windowRender(this.windowS)
    chartRender(chartS)
    chartS.classed(`chart-${data.type}`, true)
  }

  protected postRender() {
    if (this.layouterS) {
      const boundsChanged = layouterCompute(this.layouterS)
      if (boundsChanged) this.initializeRender()
    }
  }
}
