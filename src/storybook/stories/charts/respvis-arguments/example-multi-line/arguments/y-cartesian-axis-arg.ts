import {CartesianAxisUserArgs} from "../../../../../../ts/respvis-cartesian/cartesian-axis-validation";
import {y as yRotating} from './y-ticks-rotating-flipped-arg'

export const y: CartesianAxisUserArgs = {...yRotating,
  horizontalLayout: "bottom",
  verticalLayout: "left",
  gridLineFactor: 2
}
