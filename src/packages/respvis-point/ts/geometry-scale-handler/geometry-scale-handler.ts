import {elementFromSelection, getCurrentRespVal, Renderer, RespValByValueOptional, ScaledValues} from "respvis-core";

export type RenderState<X extends ScaledValues, Y extends ScaledValues> = {
  flipped: RespValByValueOptional<boolean>
  renderer: Renderer
  originalXValues: X
  originalYValues: Y
}

export class GeometryScaleHandler<X extends ScaledValues, Y extends ScaledValues> {
  originalXValues: X
  originalYValues: Y
  renderer: Renderer
  flipped: RespValByValueOptional<boolean>

  constructor(renderState: RenderState<X, Y>) {
    this.originalXValues = renderState.originalXValues
    this.originalYValues = renderState.originalYValues
    this.renderer = renderState.renderer
    this.flipped = renderState.flipped
  }

  currentlyFlipped() {
    return getCurrentRespVal( this.flipped, { chart: elementFromSelection(this.renderer.chartS) })
  }

  getCurrentXValues() {
    return this.currentlyFlipped() ? this.originalYValues : this.originalXValues
  }

  getCurrentYValues() {
    return this.currentlyFlipped() ? this.originalXValues : this.originalYValues
  }

  getXPosition(index: number) {
    const scaledValue = this.getCurrentXValues()
    return scaledValue.getScaledValue(index)!
  }

  getYPosition(index: number) {
    const scaledValue = this.getCurrentYValues()
    return scaledValue.getScaledValue(index)!
  }
}
