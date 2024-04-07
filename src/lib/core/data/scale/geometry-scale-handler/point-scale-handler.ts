import {GeometryScaleHandler, RenderState} from "./geometry-scale-handler";
import {ScaledValuesLinear} from "../scaled-values-linear";
import {AxisDomainRV} from "../axis-scaled-values-validation";
import {Circle} from "../../../utilities/graphic-elements/circle";
import {ScaledValues, ScaledValuesBase} from "../scaled-values-base";
import {ScaledValuesCategorical} from "../scaled-values-categorical";

type RenderStatePoint = RenderState<ScaledValues, ScaledValues> & {
  radii: ScaledValuesLinear | number
}

export class PointScaleHandler extends GeometryScaleHandler<ScaledValues, ScaledValues> {
  public radii: ScaledValuesLinear | number
  constructor(state: RenderStatePoint) {
    super(state);
    this.radii = state.radii
  }

  getRadius(i: number) {
    return typeof this.radii === "number" ? this.radii : this.radii.getScaledValue(i)
  }

  getRadiusValue(i: number) {
    return typeof this.radii === "number" ? undefined : this.radii.values[i]
  }
  getPointCircle(i: number): Circle {
    const currentX = this.getCurrentXValues()
    const currentY = this.getCurrentYValues()

    const calcGraphicValue = (scaledValues: ScaledValuesBase<AxisDomainRV>, index: number) => {
      if (scaledValues instanceof ScaledValuesCategorical) {
        return scaledValues.getScaledValue(i) + scaledValues.scale.bandwidth() / 2
      }
      return scaledValues.getScaledValue(i)
    }
    return {
      center: {
        x: calcGraphicValue(currentX, i),
        y: calcGraphicValue(currentY, i),
      },
      radius: this.getRadius(i) ?? 5
    }
  }
}
