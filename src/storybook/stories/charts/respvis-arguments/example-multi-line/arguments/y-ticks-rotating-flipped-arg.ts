import {CartesianAxisUserArgs} from "../../../../../../lib/cartesian/cartesian-axis-validation";

export const y: CartesianAxisUserArgs = {
  title: 'Consumption',
  breakPoints: {
    width: {
      values: [10, 30, 50],
      unit: 'rem'
    }
  },
  tickOrientationFlipped: {
    dependentOn: 'width',
    scope: 'self',
    mapping: {0: 90, 3: 0},
  },

}
