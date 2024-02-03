import {GeometryScaleHandler} from "./geometry-scale-handler";
import {Rect} from "../../../utilities/rect";

export class RectScaleHandler extends GeometryScaleHandler {
  getBarRect(i: number) {
    return this.renderState.flipped ? this.getHorizontalBarRect(i) : this.getVerticalBarRect(i)
  }

  getHorizontalBarRect(i: number): Rect {
    const x = this.getCurrentXValues()
    const y = this.getCurrentYValues()
    return {
      x: Math.min(x.scale(0)!, x.getScaledValue(i)),
      y: y.getScaledValue(i),
      width: Math.abs(x.scale(0)! - x.getScaledValue(i)),
      height: y.scale.bandwidth()
    }
  }

  getVerticalBarRect(i: number): Rect {
    const x = this.getCurrentXValues()
    const y = this.getCurrentYValues()
    return {
      x: x.getScaledValue(i),
      y: Math.min(y.scale(0)!, y.getScaledValue(i)),
      width: x.scale.bandwidth(),
      height: Math.abs(y.scale(0)! - y.getScaledValue(i))
    }
  }
}
