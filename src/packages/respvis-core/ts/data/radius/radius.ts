import {InterpolatedRadius, InterpolatedRadiusUserArgs} from "./interpolated-radius";
import {BubbleRadius, BubbleRadiusUserArgs} from "./bubble-radius";

export type RadiusUserArgs = InterpolatedRadiusUserArgs | BubbleRadiusUserArgs
export type Radius = InterpolatedRadius | BubbleRadius
