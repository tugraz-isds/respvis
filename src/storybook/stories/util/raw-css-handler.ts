export class RawCSSHandler {
  private styleElement: HTMLStyleElement
  constructor(private rawCSS: string | string[]) {
    this.styleElement = document.createElement('style');
    this.styleElement.textContent = Array.isArray(rawCSS) ? rawCSS.join('\n') : rawCSS;
  }
  addToHead() {
    document.head.appendChild(this.styleElement)
  }
  removeFromHead() {
    if (this.styleElement.parentNode === document.head) {
      document.head.removeChild(this.styleElement)
    }
  }
}
