import {Orientation, RotationDirection} from "../../constants/types";
import {RespValByValueOptional} from "../responsive-value/responsive-value-value";

export type TickOrientationArgs = {
  rotationDirection?: RotationDirection
  orientation: RespValByValueOptional<Orientation>
  //TODO: maybe add property for indicating abrupt or continuous transition
}

export type TickOrientationValid = Required<TickOrientationArgs>

export function tickOrientationValidation(args?: TickOrientationArgs): TickOrientationValid {
  return {
    rotationDirection: args?.rotationDirection ?? 'counterclockwise',
    orientation: args?.orientation ?? 'horizontal'
  }
}
