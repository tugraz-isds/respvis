export function uniqueId () {
  //@ts-ignore
  if (window.crypto && window.crypto.randomUUID) return crypto.randomUUID()
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 12).padStart(12, '0')
}
