import {findMatchingBoundsIndex} from '../../libs/respvis/respvis.js';
import { format } from '../../libs/d3-7.6.0/d3.js'

const responsiveData = [
    { minWidth: '41.25rem' },
    { minWidth: '23.75rem' },
]

export function chooseResponsiveData(data, element) {
    const index = findMatchingBoundsIndex(element, responsiveData)

    switch (index) {
        case 0: data.title = 'Electric power consumption (kWh per capita)' ; break
        case 1: data.title = 'Power Consumption (kWh)' ; break
        default: data.title = 'Pow. Cons.' ; break
    }

    switch (index) {
        case 0: data.legend.title = 'Continents' ; break
        default: data.legend.title = '' ; break
    }

    switch (index) {
        case 1: data.yAxis.configureAxis = (axis) => axis.tickFormat(format('.2s')); break
        default:
    }
}
