import {Series} from "respvis-core";

const placeholder = 'empty-series'
export class EmptySeries extends Series {
    getCombinedKey(i: number) { return placeholder }
    getScaledValuesAtScreenPosition() {
      return { horizontalName: placeholder, horizontal: placeholder, vertical: placeholder, verticalName: placeholder };
    }
    clone(): Series {
        return new EmptySeries({
          key: this.key,
          renderer: this.renderer
        })
    }
}
