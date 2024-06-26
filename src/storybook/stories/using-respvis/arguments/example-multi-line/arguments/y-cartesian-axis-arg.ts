import {CartesianAxisUserArgs} from "respvis-cartesian";
import {y as yRotating} from './y-ticks-rotating-flipped-arg'

export const y: CartesianAxisUserArgs = {...yRotating,
  horizontalLayout: "bottom",
  verticalLayout: "left",
  gridLineFactor: 2
}
