import {findMatchingBoundsIndex} from '../../../libs/respvis/respvis.js';

const bounds = [
    { maxWidth: '25rem' },
]

export function chooseAxisFormat(axis, data) {
    if (data.flipped) {
        // data.xAxis.configureAxis = (a) => a.tickFormat((v) => `${v}%`)
        return;
    }
    const index = findMatchingBoundsIndex(axis, bounds)
    switch (index) {
        case 0: data.xAxis.configureAxis = (a) => a.tickFormat((v) => `'${v.slice(-2)}`); break
        default: return
    }
}
