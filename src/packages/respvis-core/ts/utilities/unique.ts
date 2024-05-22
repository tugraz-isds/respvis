export function uniqueId () {
  //@ts-ignore
  if (window.crypto && window.crypto.randomUUID) return crypto.randomUUID()

  //Taken from https://stackoverflow.com/questions/3231459/how-can-i-create-unique-ids-with-javascript
  // Tofandel Aug 14, 2023
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 12).padStart(12, '0')
}
