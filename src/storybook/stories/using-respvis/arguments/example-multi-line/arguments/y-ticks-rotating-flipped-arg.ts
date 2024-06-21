import {BaseAxisUserArgs} from "respvis-core";

export const y: BaseAxisUserArgs = {
  title: 'Consumption',
  breakpoints: {
    width: {
      values: [10, 30, 50],
      unit: 'rem'
    }
  },
  tickOrientationFlipped: {
    dependentOn: 'width',
    scope: 'self',
    mapping: {0: 90, 3: 0},
  }
}
