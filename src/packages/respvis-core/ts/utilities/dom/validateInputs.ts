import {select} from "d3";
import {NumberLabel} from "../../render/toolbar/tool/input-label/number-label";

export function validateNumberLabel(e: HTMLInputElement, d: NumberLabel) {
  const value = parseInt(e.value)
  const errorS = select(e.parentNode as any).selectAll('.error-message')

  if (isNaN(value)) errorS?.text('No valid number!')
  else if (!d.inMinMaxRange(value)) errorS?.text('Number not in allowed range!')
  else {
    errorS?.text('')
    e.closest('label')?.classList.remove('error')
  }
  if (errorS?.text()) {
    e.closest('label')?.classList.add('error')
    return null
  }

  return value.toString()
}

// const onInputNumber = (e, d: NumberLabel) => {
//   const value = d.valueAsInt(e)
//   if (isNaN(value)) e.target.value = currentSettings.state[d.data.type]
// }
// const onChangeNumber = (e, d: NumberLabel) => {
//   const value = d.valueAsInt(e)
//   if (isNaN(value) || !d.inMinMaxRange(value)) {
//     e.target.value = currentSettings.state[d.data.type]
//   }
//   currentSettings.state[d.data.type] = (e.target as HTMLInputElement).value
// }
