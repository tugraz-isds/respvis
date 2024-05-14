import {zoom, ZoomBehavior, zoomIdentity, ZoomTransform} from "d3";

export type ZoomArgs = {
  in: number
  out: number
}
export type ZoomValid = ZoomArgs & {
  currentIn: number
  currentOut: number
  currentTransform: ZoomTransform
  behaviour: ZoomBehavior<Element, unknown>
}

export function zoomValidation(args: ZoomArgs): ZoomValid {
  return {
    ...args,
    currentIn: args.in,
    currentOut: args.out,
    currentTransform: zoomIdentity,
    behaviour: zoom()
  }
}
