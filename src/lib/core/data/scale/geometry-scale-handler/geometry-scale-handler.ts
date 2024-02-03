import {ScaledValuesBase} from "../scaled-values-base";
import {AxisDomainRV} from "../axis-scaled-values-validation";

export type RenderState = {
  flipped: boolean
  originalXValues: ScaledValuesBase<AxisDomainRV>
  originalYValues: ScaledValuesBase<AxisDomainRV>
}

export class GeometryScaleHandler {
  constructor(public renderState: RenderState) {}

  getCurrentXValues() {
    const {flipped, originalXValues, originalYValues} = this.renderState
    return flipped ? originalYValues : originalXValues
  }

  getCurrentYValues() {
    const {flipped, originalXValues, originalYValues} = this.renderState
    return flipped ? originalXValues : originalYValues
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
