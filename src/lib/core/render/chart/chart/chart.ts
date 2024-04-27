import {dispatch, Selection} from "d3";
import {SVGHTMLElement} from "../../../constants/types";
import {WindowArgs, windowRender, WindowValid, windowValidation} from "../../window";
import {ChartArgs, ChartValid, chartValidation} from "./chart-validation";
import {Renderer} from "../renderer";
import {resizeEventListener} from "../../../resize-event-dispatcher";
import {layouterCompute} from "../../../layouter/layouter";
import {chartRender} from "./chart-render";
import {throttle} from "../../../utilities/d3/util";
import {fixActiveCursor} from "../../util/fix-active-cursor";

export type ChartWindowedValid = WindowValid & ChartValid

export class Chart implements Renderer {
  private addedListeners = false
  protected initialRenderHappened = false
  public readonly filterDispatch = dispatch<{ dataKey: string }>('filter')
  protected renderCountSinceResize = 0
  protected rerenderAfterLayoutChangeScheduled?: NodeJS.Timeout
  protected resizeObserver?: ResizeObserver
  private resizeThrottle?: ReturnType<typeof throttle>
  legendS?: Selection<SVGHTMLElement>
  private unmounted: boolean = false;

  constructor(windowSelection: Selection<HTMLDivElement>, args: Omit<WindowArgs & ChartArgs, 'renderer'>) {
    const initialWindowData = windowValidation({...args, renderer: this})
    const chartData = chartValidation({...args, renderer: this})
    windowSelection.datum({...initialWindowData, ...chartData})
    this._windowS = windowSelection as Selection<HTMLDivElement, ChartWindowedValid>
  }

  _windowS?: Selection<HTMLElement, ChartWindowedValid>
  get windowS(): Selection<HTMLElement, ChartWindowedValid> {
    return (this._windowS && !this._windowS.empty()) ? this._windowS :
      this.windowS.selectAll<HTMLElement, ChartWindowedValid>('.window-rv')
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
  _drawAreaS?: Selection<SVGGElement>
  get drawAreaS(): Selection<SVGGElement> {
    return (this._drawAreaS && !this._drawAreaS.empty()) ? this._drawAreaS :
      this.chartS.selectAll<SVGGElement, any>('.draw-area')
  }
  _drawAreaBgS?: Selection<SVGRectElement>
  get drawAreaBgS(): Selection<SVGRectElement> {
    return (this._drawAreaBgS && !this._drawAreaBgS.empty()) ? this._drawAreaBgS :
      this.drawAreaS.selectChildren<SVGRectElement, any>('.background')
  }
  _drawAreaClipPathS?: Selection<SVGClipPathElement>
  get drawAreaClipPathS(): Selection<SVGClipPathElement> {
    return (this._drawAreaClipPathS && !this._drawAreaClipPathS.empty()) ? this._drawAreaClipPathS :
      this.drawAreaS.selectChildren<SVGClipPathElement, any>('.draw-area__clip')
  }

  buildChart() {
    this.render()
    if (this.addedListeners) return
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

  private initializeRender() {
    clearTimeout(this.rerenderAfterLayoutChangeScheduled)
    const instance = this
    if (this.renderCountSinceResize > 2) {
      /* DEV_MODE_ONLY_START */
      console.log('TOO MANY RENDERS. THERE MUST BE A PROBLEM')
      /* DEV_MODE_ONLY_END */
      return
    }
    this.renderCountSinceResize++
    instance.render()
  }

  private render() {
    if (!(this.windowS.node() as Element).isConnected || this.unmounted) return
    this.mainRender()
    this.reLayout()
    this.addFinalListeners()
    this.initialRenderHappened = true
  }

  protected mainRender() {
    const data = this.windowS.datum()
    const {chartS} = windowRender(this.windowS)
    chartRender(chartS)
    chartS.classed(`chart-${data.type}`, true)
    fixActiveCursor(chartS)
  }

  private reLayout() {
    if (this.layouterS) {
      const boundsChanged = layouterCompute(this.layouterS)
      if (boundsChanged) {
        // Timout is necessary to detect subsequent resizes
        this.rerenderAfterLayoutChangeScheduled = setTimeout(() => {
          this.initializeRender()
        }, 100)
      }
    }
  }

  unmountChart() {
    this.unmounted = true
    this.windowS.remove()
    // delete this
  }
}
