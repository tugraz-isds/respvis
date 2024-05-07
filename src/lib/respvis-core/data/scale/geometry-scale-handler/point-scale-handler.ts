import {GeometryScaleHandler, RenderState} from "./geometry-scale-handler";
import {ScaledValuesLinear} from "../scaled-values-linear";
import {Circle} from "../../../utilities/graphic-elements/circle";
import {ScaledValues} from "../scaled-values-base";

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
    return {
      center: {
        x: this.getCurrentXValues().getScaledValue(i),
        y: this.getCurrentYValues().getScaledValue(i),
      },
      radius: this.getRadius(i) ?? 5
    }
  }
}
