import {zoom, ZoomBehavior, zoomIdentity, ZoomTransform} from "d3";

export type ZoomArgs = {
  in: number
  out: number
}
export type Zoom = ZoomArgs & {
  currentIn: number
  currentOut: number
  currentTransform: ZoomTransform
  behaviour: ZoomBehavior<Element, unknown>
}

export function validateZoom(args: ZoomArgs): Zoom {
  return {
    ...args,
    currentIn: args.in,
    currentOut: args.out,
    currentTransform: zoomIdentity,
    behaviour: zoom()
  }
}
