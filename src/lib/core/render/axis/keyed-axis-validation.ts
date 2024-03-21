import {AxisBaseArgs, AxisBaseValid, axisBaseValidation} from "./axis-base-validation";
import {AxisKey} from "../../constants/types";

export type KeyedAxisArgs = AxisBaseArgs & {
  key: AxisKey
}

export type KeyedAxisValid = AxisBaseValid & {
  key: AxisKey
}

export function keyedAxisValidation(args:KeyedAxisArgs) {
  return {
    ...axisBaseValidation(args),
    key: args.key
  }
}
