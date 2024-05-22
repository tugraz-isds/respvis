import {CartesianAxisUserArgs} from "respvis-cartesian";
import {x as xRotating} from './x-ticks-rotating-arg'

export const x: CartesianAxisUserArgs = {...xRotating,
  horizontalLayout: "top",
  verticalLayout: "right",
  gridLineFactor: 1
}
