import {findMatchingBoundsIndex} from '../../../libs/respvis/respvis.js';

const responsiveData = [
    { maxWidth: '27.5rem' },
    { maxWidth: '36.25rem' },
]

export function chooseResponsiveData(data, element) {
    const index = findMatchingBoundsIndex(element, responsiveData)
    switch (index) {
        case 0: case 1: data.title = 'Browser Share'; break
        default:
    }
    switch (index) {
        case 0: case 1: data.legend.title = ''; break
        default:
    }
    switch (index) {
        case 0: data.flipped = true; break
        default:
    }
}
