import {Renderer} from "../../../chart/renderer";
import {cssVars} from "../../../../constants/cssVars";

export function prettifySVG(code: string, renderer: Renderer) {
  const propertiesToRemove = cssVars.map(cssVar => cssVar)
    .filter(cssVar => cssVar !== '--layout-width' && cssVar !== '--layout-height')
  let prettifiedSVG = removePropertiesFromSVGStyle(code, propertiesToRemove)

  if (!renderer.windowS.datum().windowSettings.downloadPrettifyActive) return prettifiedSVG
  prettifiedSVG = addNewLinesBeforeOpeningTags(prettifiedSVG)
  prettifiedSVG = addNewlineBeforeGroupCloseTag(prettifiedSVG)
  const indentationSpaces = ' '.repeat(parseInt(renderer.windowS.datum().windowSettings.downloadPrettifyIndentionSpaces))
  prettifiedSVG = addTabsPerNestingLevel(prettifiedSVG, indentationSpaces)
  prettifiedSVG = prettifyStyleTags(prettifiedSVG)
  return prettifiedSVG
}

function addNewLinesBeforeOpeningTags(code: string) {
  return code.replace(/<([^\/\?])/g, "\n$&")
}

function addNewlineBeforeGroupCloseTag(code: string) {
  //text|tspan
  const regexGroupTags = /(<\/(svg|g|defs|symbol|marker|a|switch|mask|clipPath|pattern|filter|textPath|use)>)/g;
  return code.replace(regexGroupTags, "\n$1")
}

function addTabsPerNestingLevel(code: string, indentationChars: string) {
  //text|tspan
  const regexAllTags = /(<\/?(svg|g|defs|symbol|marker|a|switch|mask|clipPath|pattern|filter|use|rect|circle|ellipse|line|polyline|polygon|path|image|text|textPath|tspan|glyph|missing-glyph|foreignObject).*?>)/g
  const regexNesting = /(<\/?(svg|g|defs|symbol|marker|a|switch|mask|clipPath|pattern|filter|textPath|use).*?>)/g
  const regexNonNesting = /(<\/?(rect|circle|ellipse|line|polyline|polygon|path|image|text|textPath|tspan|glyph|missing-glyph|foreignObject).*?>)/g
  let tabs = 0
  return code.replace(regexAllTags, (match, p1) => {
    if (p1.startsWith('</') && match.match(regexNesting)) {
      tabs--;
    }
    const tabString = indentationChars.repeat(tabs);
    if (!p1.startsWith('</') && match.match(regexNesting)) {
      tabs++;
    }
    if (p1.startsWith('</') && match.match(regexNonNesting)) return p1
    return `${tabString}${p1}`;
  });
}

function prettifyStyleTags(code: string) {
  const regexStyle = /<style[^>]*>([\s\S]*?)<\/style>/g;

  return code.replace(regexStyle, (match, p1) => {
    let cssCode: string = p1
    cssCode = cssCode.replace(/{/g, "{\n")
    cssCode = cssCode.replace(/}/g, "}\n\n")

      // &amp
    const lines = cssCode.split(/(?<!&amp);/).map(line => line.trim())

    const prettifiedLines = new Array<string>();
    const spacesPerTab = 4;
    let indentLevel = 0;

    lines.forEach((line, index) => {
      if (line) {
        const indentation = ' '.repeat(spacesPerTab * indentLevel);
        prettifiedLines.push(indentation + line + (index < (lines.length - 1) ? ';' : ''));
      }
    });

    const prettifiedCSS = prettifiedLines.join('\n');
    return `<style>\n${prettifiedCSS}\n</style>`;
  });
}

function removePropertiesFromSVGStyle(code: string, propertiesToRemove: string[]): string {
  const styleRegex = /(\s)style\s*=\s*"([^"]*)"/g;

  function removePropertiesFromStyle(style: string): string {
    const propertyRegex = /([^:]+)\s*:\s*([^;]+);?/g
    let updatedStyle = ''
    let match
    while ((match = propertyRegex.exec(style)) !== null) {
      const propertyName = match[1].trim()
      const propertyValue = match[2].trim()
      if (!propertiesToRemove.includes(propertyName)) {
        updatedStyle += `${propertyName}:${propertyValue};`
      }
    }
    return updatedStyle
  }

  return code.replace(styleRegex, (_match, whiteSpace, styleAttr) => {
    const modifiedStyle = removePropertiesFromStyle(styleAttr)
    return ` style="${modifiedStyle}"`
  })
}
