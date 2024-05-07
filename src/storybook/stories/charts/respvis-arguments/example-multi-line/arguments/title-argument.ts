import {RespValByValue} from "respvis-core/data/responsive-value/responsive-value-value";

export const title: RespValByValue<string> = {
  dependentOn: 'width',
    mapping: {0: 'Power (kWh)', 1: 'Power Consumption (kWh)', 3: 'Electric Power Consumption (kWh per Capita)'}
}
