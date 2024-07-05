import {BaseRadius, BaseRadiusUserArgs} from "./base-radius";
import {BubbleRadius, BubbleRadiusUserArgs} from "./bubble-radius";

export type RadiusUserArgs = BaseRadiusUserArgs | BubbleRadiusUserArgs
export type Radius = BaseRadius | BubbleRadius
