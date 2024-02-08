import {zoom, ZoomBehavior} from "d3";

export type ZoomArgs = {
  in: number,
  out: number
}
export type ZoomValid = ZoomArgs & {
  behaviour: ZoomBehavior<Element, unknown>
}

export function zoomValidation(args: ZoomArgs): ZoomValid {
  return {
    ...args,
    behaviour: zoom()
  }
}
