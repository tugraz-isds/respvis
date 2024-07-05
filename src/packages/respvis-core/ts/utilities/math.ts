export function calcLimited(num: number, lowerLimit: number, upperLimit: number) {
  const overflow = num > upperLimit
  const underflow = num < lowerLimit
  return overflow ? upperLimit : underflow ? lowerLimit : num
}

export function calcDiffLimited(num: number, maxDecrement: number, maxIncrement: number) {
  return num < maxDecrement ? maxDecrement :
    num > maxIncrement ? maxIncrement : num
}
