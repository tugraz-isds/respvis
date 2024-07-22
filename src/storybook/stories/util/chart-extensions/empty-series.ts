import {DataSeries} from "respvis-core";
import {SeriesTooltipGenerator} from "../../../../packages";

const placeholder = 'empty-series'

export class EmptySeries extends DataSeries {
    markerTooltipGenerator?: SeriesTooltipGenerator<SVGElement, any> | undefined;
    getCombinedKey(i: number) { return placeholder }
    getScaledValuesAtScreenPosition() {
      return { horizontalName: placeholder, horizontal: placeholder, vertical: placeholder, verticalName: placeholder };
    }
    clone(): DataSeries {
        return new EmptySeries({
          key: this.key,
          renderer: this.renderer
        })
    }
}
