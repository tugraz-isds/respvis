import {timeFormat} from "d3";
import {CartesianAxisUserArgs} from "../../../../../../lib/cartesian/cartesian-axis-validation";

export const x: CartesianAxisUserArgs = {
  title: 'Year',
    subTitle: '[2012 to 2021]',
    tickOrientation: {
    dependentOn: 'width',
      scope: 'self',
      mapping: {0: 90, 3: 0},
  },
  breakPoints: {
    width: {
      values: [10, 30, 50],
        unit: 'rem'
    }
  },
  configureAxis: (axis) => axis.tickFormat(timeFormat('%Y'))
}
