import {CartesianAxisUserArgs} from "../../../../../../lib/cartesian/cartesian-axis-validation";
import {x as xRotating} from './x-ticks-rotating-arg'

export const x: CartesianAxisUserArgs = {...xRotating,
  horizontalLayout: "top",
  verticalLayout: "right",
  gridLineFactor: 1
}
