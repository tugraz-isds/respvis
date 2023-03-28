import {findMatchingBoundsIndex} from '../../libs/respvis/respvis.js';

const responsiveData = [
    { maxWidth: '27.5rem' },
    { maxWidth: '30.625rem' },
]

export function chooseResponsiveData(data, element) {
    const index = findMatchingBoundsIndex(element, responsiveData)
    switch (index) {
        case 0: case 1: data.title = 'M.S. Browsers'; break
        default: return
    }
    switch (index) {
        case 0: data.legend.title = ''; break
        default: return
    }
    switch (index) {
        case 0: data.flipped = true; break
        default: return
    }
}
