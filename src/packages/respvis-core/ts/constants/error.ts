export const ErrorMessages = {
  categoricalValuesMismatch: 'Number of categorical values does not match with number of reference values!',
  sequentialColorValuesMismatch: 'Number of sequentially colored values does not match with number of reference values!',
  defaultError: 'An internal error occurred in RespVis!',
  invalidResponsiveValue: 'You passed an invalid responisve value object!',
  invalidExtremaCombination: 'You passed an invalid combination of minimum and maximum values!',
  elementNotExisting: 'An accessed element did not exist!',
  responsiveValueHasNoValues: 'A responsive value was not provided with any value!',
  invalidScaledValuesCombination: 'You passed an invalid scale for the corresponding domain of values!',
  invalidArgumentForSeries: 'You passed an invalid argument for a specific type of series!',
  missingArgumentForSeries: 'You did not pass a necessary argument for a specific type of series!',
  invalidWindowsSetting: 'Currently a setting is set to an invalid value!',
  evaluatingCSSUnitError: 'Evaluating CSS unit was not successful. Make sure to pass necessary context information!',
  convertingInvalidUnit: `Invalid unit cannot be converted!`,
  emptyValueArrayProvided: `The array of values passed to RespVis was empty!`,
  parcoordMinAxesCount: 'Parcoord Chart must have a minimal axis count of 2!'
}
