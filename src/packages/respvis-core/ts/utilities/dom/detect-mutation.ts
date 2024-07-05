export function detectClassChange(element: Element, onClassChange: () => void) {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        onClassChange()
      }
    }
  })
  const config = { attributes: true, attributeFilter: ['class'] };
  observer.observe(element, config);
  return {observer}
}
