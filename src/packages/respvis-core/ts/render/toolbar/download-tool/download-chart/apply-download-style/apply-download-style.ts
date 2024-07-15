import {getActiveCSSRulesForElement} from "./get-active-cssrules";
import {Renderer} from "../../../../chart/renderer";
import {
  elementComputedStyleWithoutDefaults,
  elementSVGPresentationAttrs,
  elementSVGTransformStyles
} from "../../../../../utilities/dom/element";
import {ErrorMessages} from "../../../../../constants/error";
import {
  cssContentFromEntries,
  getActiveCSSVars,
  getRelevantCSSVars
} from "../../../../toolbar/download-tool/download-chart/apply-download-style/get-active-cssvars";
import {createCSSRule} from "../../../../toolbar/download-tool/download-chart/apply-download-style/create-cssrule";

export function applyDownloadStyle(original: SVGSVGElement, clone: SVGSVGElement, renderer: Renderer) {
  const { windowSettings } = renderer.windowS.datum()
  switch (windowSettings.get('downloadStyleType')) {
    case "embedded": embedCSS(original, clone); break
    case "inline": attrsFromComputedStyle(clone, original); break
    default: {
      attrsFromComputedStyle(clone, original)
      /* DEV_MODE_ONLY_START */
      throw new Error(ErrorMessages.invalidScaledValuesCombination)
      /* DEV_MODE_ONLY_END */
    }
  }
}

function embedCSS(original: SVGSVGElement, clone: SVGSVGElement) {
  const activeCSSRules = Array.from<string>(getActiveCSSRulesForElement(original))
  const activeCSSVars = getActiveCSSVars(original)
  const relevantCSSVars = getRelevantCSSVars(activeCSSVars, [...activeCSSRules])
  const cssVarRule = createCSSRule('.chart', cssContentFromEntries(relevantCSSVars))
  const styleTag = document.createElement("style");
  [...activeCSSRules, cssVarRule].forEach((rule) => {
    const ruleXMLConform = rule.replace(/&/g, '&amp;')
    styleTag.appendChild(document.createTextNode(ruleXMLConform))
  })

  clone.appendChild(styleTag);
  copyInlineStyles(clone, original)
}

function copyInlineStyles(target: Element, source: Element) {
  const style = (source as SVGElement).style.cssText
  if (style) {
    (target as SVGElement).style.cssText = style
  }
  for (let i = 0; i < source.children.length; ++i) {
    copyInlineStyles(target.children[i], source.children[i]);
  }
}

function attrsFromComputedStyle(target: SVGElement | HTMLElement, source: Element) {
  const svgPresentationStyle = elementComputedStyleWithoutDefaults(source, elementSVGPresentationAttrs);
  for (let prop in svgPresentationStyle) {
    target.setAttribute(prop, svgPresentationStyle[prop]);
  }
  applyTransformOriginStyles(target, source)
  for (let i = 0; i < source.children.length; ++i) {
    const child = target.children[i] as (SVGElement | HTMLElement)
    attrsFromComputedStyle(child, source.children[i]);
  }
}

//Check if text elements use 'transform-box' and 'transform-origin'. If so, apply to transform matrix attribute
function applyTransformOriginStyles(target: SVGElement | HTMLElement, source: Element) {
  if (source.tagName !== 'text') return
  const matrixPrev = target.getAttribute('transform')
  const svgTransformStyles = elementComputedStyleWithoutDefaults(source, elementSVGTransformStyles)
  if (!('transform-origin' in svgTransformStyles) || !('transform-box' in svgTransformStyles) || !matrixPrev) return

  const transformOriginRegex = /(-?\d*\.?\d+)px (-?\d*\.?\d+)px/;
  const match = transformOriginRegex.exec(svgTransformStyles['transform-origin'])
  if (!match) return

  const { x: bboxX, y: bboxY} = (source as SVGTextElement).getBBox()
  const xTrans = bboxX + parseFloat(match[1])
  const yTrans = bboxY + parseFloat(match[2])

  const baseMatrix = new DOMMatrix(matrixPrev)
  const transformToOriginMatrix = new DOMMatrix()
  transformToOriginMatrix.e = xTrans
  transformToOriginMatrix.f = yTrans
  const transformFromOriginMatrix = new DOMMatrix()
  transformFromOriginMatrix.e = -xTrans
  transformFromOriginMatrix.f = -yTrans

  const finalMatrix = transformToOriginMatrix.multiply(baseMatrix).multiply(transformFromOriginMatrix)

  const matrixString = `matrix(${finalMatrix.a}, ${finalMatrix.b}, ${finalMatrix.c}, ${finalMatrix.d}, ${finalMatrix.e}, ${finalMatrix.f})`
  target.setAttribute('transform', matrixString);
}
