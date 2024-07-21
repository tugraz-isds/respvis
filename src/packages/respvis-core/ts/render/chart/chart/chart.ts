import {dispatch, Selection} from "d3";
import {renderWindow, validateWindow, Window, WindowArgs} from "../../window";
import {ChartData, ChartDataUserArgs, validateChart} from "./validate-chart";
import {Renderer} from "../renderer";
import {ReRenderContext, resizeEventListener} from "./resize-event-dispatcher";
import {renderChart} from "./render-chart";
import {attachActiveCursorLocking, ThrottleScheduled} from "../../../utilities";
import {layouterCompute, renderLayouter} from "../../layouter";
import {Legend} from "../../legend";
import {renderTooltip} from "respvis-tooltip";

export type ChartWindowed = Window & ChartData
export type ChartUserArgs = Omit<WindowArgs & ChartDataUserArgs, 'renderer'>

export class Chart implements Renderer {
  private addedListeners = false
  protected initialRenderHappened = false
  public readonly filterDispatch = dispatch<{ dataKey: string }>('filter')
  protected subsequentRenderCount = 0
  protected rerenderAfterResizeScheduled?: NodeJS.Timeout
  protected resizeObserver?: ResizeObserver
  private immediateInteractionThrottle?: ThrottleScheduled<any, any>
  private standardInteractionThrottle?: ThrottleScheduled<any, any>
  private unmounted: boolean = false;

  constructor(windowSelection: Selection<HTMLElement>, args: ChartUserArgs) {
    const initialWindowData = validateWindow({...args, renderer: this})
    const chartData = validateChart({...args, renderer: this})
    windowSelection.datum({...initialWindowData, ...chartData})
    this._windowS = windowSelection as Selection<HTMLElement, ChartWindowed>
  }

  _windowS?: Selection<HTMLElement, ChartWindowed>
  get windowS(): Selection<HTMLElement, ChartWindowed> {
    return (this._windowS && !this._windowS.empty()) ? this._windowS :
      this.windowS.selectAll<HTMLElement, ChartWindowed>('.window-rv')
  }

  _layouterS?: Selection<HTMLDivElement>
  get layouterS(): Selection<HTMLDivElement> {
    return (this._layouterS && !this._layouterS.empty()) ? this._layouterS :
      this.windowS.selectAll<HTMLDivElement, any>('.layouter')
  }

  _chartS?: Selection<SVGSVGElement, ChartWindowed>
  get chartS(): Selection<SVGSVGElement, ChartWindowed> {
    return (this._chartS && !this._chartS.empty()) ? this._chartS :
      this.layouterS.selectAll<SVGSVGElement, ChartWindowed>('svg.chart')
  }

  _legendS?: Selection<SVGGElement, Legend>
  get legendS(): Selection<SVGGElement, Legend> {
    return (this._legendS && !this._legendS.empty()) ? this._legendS :
      this.chartS.selectAll<SVGGElement, Legend>('.legend')
  }

  _paddingWrapperS?: Selection<SVGGElement, ChartWindowed>
  get paddingWrapperS(): Selection<SVGGElement, ChartWindowed> {
    return (this._paddingWrapperS && !this._paddingWrapperS.empty()) ? this._paddingWrapperS :
      this.chartS.selectAll<SVGGElement, ChartWindowed>('.padding-wrapper')
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

  exitEnterActive() {
    return this.windowS.selectAll('.entering, .exiting').size() > 0
  }

  buildChart() {
    this.render()
    layouterCompute(this.layouterS)
    if (this.addedListeners) return
    const chartDivS = this.layouterS.selectChild('div.chart')
    if (chartDivS) this.resizeObserver = resizeEventListener(
      chartDivS as Selection<Element>, this.windowS)
    this.addedListeners = true
    this.render()
    layouterCompute(this.layouterS)
  }

  /**
   * Adds custom event listener. Be sure to add custom event listeners before calling {@link Chart.buildChart}
   * as the method also adds listeners and the order matters.
   */
  addCustomListener<T extends ChartWindowed>(name: string, callback: (event: Event, data: T) => void) {
    this.windowS.on(name, callback)
  }

  private addFinalListeners() {
    const onResize = () => {
      this.subsequentRenderCount = 0
      this.onResizeRender()
    }
    const onStandardInteraction = () => {
      if (this.windowS.selectAll('.mid-d3-transit').size() > 0) return
      this.subsequentRenderCount = 0
      this.onStandardInteractionRender()
    }
    const onImmediateInteraction = () => {
      this.subsequentRenderCount = 0
      this.onImmediateInteractionRender()
    }
    if (!this.immediateInteractionThrottle) {
      //optimal values: //chrome zooming 55 //firefox zooming 30
      this.immediateInteractionThrottle = new ThrottleScheduled<any, any>(onImmediateInteraction, 30)
    }
    if (!this.standardInteractionThrottle) {
      this.standardInteractionThrottle = new ThrottleScheduled(() =>
        this.windowS.dispatch('resize', {detail: {type: 'standard-interaction'}}), 50)
    }

    this.windowS.on('pointermove.final pointerleave.final pointerdown.final pointerup.final',
      () => this.standardInteractionThrottle?.invokeScheduled())

    this.windowS.on('resize.final', (context: { detail?: ReRenderContext }) => {
      clearTimeout(this.rerenderAfterResizeScheduled)
      switch (context.detail?.type) {
        case 'resize': onResize(); break;
        case 'standard-interaction': {
          onStandardInteraction()
          break;
        }
        case 'immediate-interaction': default: {
          this.immediateInteractionThrottle?.invokeScheduled()
          break;
        }
      }
    })
  }

  private inRenderLoop() {
    if (this.subsequentRenderCount > 3) {
      /* DEV_MODE_ONLY_START */
      console.log('TOO MANY RENDERS. THERE MUST BE A PROBLEM')
      /* DEV_MODE_ONLY_END */
      return true
    }
    this.subsequentRenderCount++
    return false
  }

  private onResizeRender() {
    if (this.inRenderLoop()) return
    this.render()
    if (!this.layouterS) return
    if (!layouterCompute(this.layouterS)) return
    this.rerenderAfterResizeScheduled = setTimeout(() => {
      this.onResizeRender()
    }, 20)
  }

  private onStandardInteractionRender() {
    if (this.inRenderLoop()) return
    if (!this.layouterS) return
    if (!layouterCompute(this.layouterS)) return //layoutercompute should return any style change?
    this.subsequentRenderCount++
    this.render()
  }

  private onImmediateInteractionRender() {
    if (this.inRenderLoop()) return
    this.render()
    if (!this.layouterS) return
    if (!layouterCompute(this.layouterS)) return //layoutercompute should return any style change?
    this.subsequentRenderCount++
    this.render()
    this.onResizeRender()
  }

  private render() {
    if (!(this.windowS.node() as Element).isConnected || this.unmounted) return
    this.renderChart()
    this.renderContent()
    this.addFinalListeners()
    this.initialRenderHappened = true
  }

  private renderChart() {
    const data = this.windowS.datum()
    renderWindow(this.windowS)
    renderLayouter(this.windowS)
    renderChart(this.layouterS, data, `chart-${data.type}`)

    if (data.tooltip.active) {
      renderTooltip()
    }

    attachActiveCursorLocking(this.chartS)
  }

  protected renderContent() {}

  unmountChart() {
    this.unmounted = true
    this.windowS.remove()
    // delete this
  }
}
