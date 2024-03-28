import {Selection} from "d3";

export function bboxDiffSVG(svgS1: Selection<SVGGraphicsElement>, svgS2: Selection<SVGGraphicsElement>) {
  const bbox1 = svgS1.node()?.getBBox();
  const bbox2 = svgS2.node()?.getBBox();
  if (!bbox1 || !bbox2) {
    /* DEV_MODE_ONLY_START */
    throw new Error()
    /* DEV_MODE_ONLY_END */
    return { leftCornersXDiff: 0, horizontalDiff: 0, leftCornersYDiff: 0, verticalDiff: 0,
      bbox1: new DOMRect(0, 0, 0, 0), bbox2: new DOMRect(0, 0, 0, 0),
    }
  }

  return {
    leftCornersXDiff: bbox2.x - bbox1.x,
    horizontalDiff: bbox2.x - bbox1.x + bbox1.width,
    leftCornersYDiff: bbox2.y - bbox1.y,
    verticalDiff: bbox2.y - bbox1.y + bbox1.height,
    bbox1, bbox2
  }
}
