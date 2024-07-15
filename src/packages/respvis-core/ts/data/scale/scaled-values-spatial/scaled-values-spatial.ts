import {ScaledValuesNumeric, ScaledValuesNumericUserArgs} from "./scaled-values-numeric";
import {ScaledValuesTemporal, ScaledValuesTemporalUserArgs} from "./scaled-values-temporal";
import {
  ScaledValuesCategorical,
  ScaledValuesCategoricalArgs,
  ScaledValuesCategoricalUserArgs
} from "./scaled-values-categorical";
import {ScaledValuesSpatialDomain} from "./validate-scaled-values-spatial";

export type ScaledValuesSpatialUserArgs<Domain extends ScaledValuesSpatialDomain> =
  Domain extends Date ? ScaledValuesTemporalUserArgs :
    Domain extends number ? ScaledValuesNumericUserArgs :
      Domain extends string ? ScaledValuesCategoricalUserArgs : never

export type ScaledValuesSpatialArgs<Domain extends ScaledValuesSpatialDomain> =
  Domain extends Date ? ScaledValuesTemporalUserArgs :
    Domain extends number ? ScaledValuesNumericUserArgs :
      Domain extends string ? ScaledValuesCategoricalArgs : never

export type ScaledValuesSpatialNumericOrTemporal = ScaledValuesNumeric | ScaledValuesTemporal
export type ScaledValuesSpatial = ScaledValuesSpatialNumericOrTemporal | ScaledValuesCategorical
