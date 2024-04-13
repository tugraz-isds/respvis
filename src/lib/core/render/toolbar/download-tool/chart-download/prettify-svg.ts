export function prettifySVG(code: string) {
  //TODO: Setting for enable disable prettify SVG
  let prettifiedSVG = addNewLinesBeforeOpeningTags(code)
  prettifiedSVG = addNewlineBeforeGroupCloseTag(prettifiedSVG)
  prettifiedSVG = addTabsPerNestingLevel(prettifiedSVG)
  return prettifyStyleTags(prettifiedSVG)
}

function addNewLinesBeforeOpeningTags(code: string) {
  return code.replace(/<([^\/\?])/g, "\n$&")
}

function addNewlineBeforeGroupCloseTag(code: string) {
  //text|tspan
  const regexGroupTags = /(<\/(svg|g|defs|symbol|marker|a|switch|mask|clipPath|pattern|filter||textPath|use)>)/g;
  return code.replace(regexGroupTags, "\n$1")
}

function addTabsPerNestingLevel(code: string) {
  //text|tspan
  const regexAllTags = /(<\/?(svg|g|defs|symbol|marker|a|switch|mask|clipPath|pattern|filter|textPath|use|rect|circle|ellipse|line|polyline|polygon|path|image|text|textPath|tspan|glyph|missing-glyph|foreignObject).*?>)/g
  const regexNesting = /(<\/?(svg|g|defs|symbol|marker|a|switch|mask|clipPath|pattern|filter|textPath|use).*?>)/g
  const regexNonNesting = /(<\/?(rect|circle|ellipse|line|polyline|polygon|path|image|text|textPath|tspan|glyph|missing-glyph|foreignObject).*?>)/g
  let tabs = 0
  return code.replace(regexAllTags, (match, p1, p2) => {
    if (p1.startsWith('</') && match.match(regexNesting)) {
      tabs--;
    }
    const tabString = '\t'.repeat(tabs);
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

    const lines = cssCode.split(';').map(line => line.trim())

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
