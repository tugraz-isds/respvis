import {ScaleContinuous} from "../scale/scales";

export type ColorContinuous = {
  values: number[]
  scale: ScaleContinuous<any, string>
};
