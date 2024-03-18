import {GeometryScaleHandler} from "./geometry-scale-handler";
import {Rect} from "../../../utilities/rect";
import {ScaledValues} from "../scaled-values-base";
import {ScaledValuesCategorical} from "../scaled-values-categorical";

export class RectScaleHandler extends GeometryScaleHandler<ScaledValuesCategorical, ScaledValues> {
  getBarRect(i: number) {
    return this.currentlyFlipped() ? this.getHorizontalBarRect(i) : this.getVerticalBarRect(i)
  }

  getHorizontalBarRect(i: number): Rect {
    const x = this.getCurrentXValues()
    const y = this.getCurrentYValues() as ScaledValuesCategorical
    let xHorizontal: number, widthHorizontal: number
    if (x.tag === 'linear' || x.tag === 'date') {
      xHorizontal = Math.min(x.scale(0)!, x.getScaledValue(i))
      widthHorizontal = Math.abs(x.scale(0)! - x.getScaledValue(i))
    } else {
      xHorizontal = x.getScaledValue(i)
      widthHorizontal = x.scale.bandwidth()
    }
    return {
      x: xHorizontal,
      y: y.getScaledValue(i),
      width: widthHorizontal,
      height: y.scale.bandwidth()
    }
  }

  getVerticalBarRect(i: number): Rect {
    const x = this.getCurrentXValues() as ScaledValuesCategorical
    const y = this.getCurrentYValues()
    let yVertical: number, heightVertical: number
    if (y.tag === 'linear' || y.tag === 'date') {
      yVertical = Math.min(y.scale(0)!, y.getScaledValue(i))
      heightVertical = Math.abs(y.scale(0)! - y.getScaledValue(i))
    } else {
      yVertical = y.getScaledValue(i)
      heightVertical = y.scale.bandwidth()
    }
    return {
      x: x.getScaledValue(i),
      y: yVertical,
      width: x.scale.bandwidth(),
      height: heightVertical
    }
  }
}
