import {Series} from "respvis-core";

const placeholder = 'empty-series'
export class EmptySeries extends Series {
    getCombinedKey(i: number) { return placeholder }
    getScaledValuesAtScreenPosition() {
      return { x: placeholder, y: placeholder };
    }
    clone(): Series {
        return new EmptySeries({
          key: this.key,
          renderer: this.renderer
        })
    }
}
