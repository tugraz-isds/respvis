import {ResponsiveValueUserArgs} from "respvis-core";

export const title: ResponsiveValueUserArgs<string> = {
  dependentOn: 'width',
    mapping: {0: 'Power (kWh)', 1: 'Power Consumption (kWh)', 3: 'Electric Power Consumption (kWh per Capita)'}
}
