import {getActiveCSSRulesForElement} from "./get-active-cssrules";
import {Renderer} from "../../../../chart/renderer";
import {
  elementComputedStyleWithoutDefaults,
  elementSVGPresentationAttrs,
  elementSVGTransformStyles
} from "../../../../../utilities/element";
import {ErrorMessages} from "../../../../../utilities/error";
import {
  cssContentFromEntries,
  getActiveCSSVars,
  getRelevantCSSVars
} from "respvis-core/render/toolbar/download-tool/download-chart/apply-download-style/get-active-cssvars";
import {
  createCSSRule
} from "respvis-core/render/toolbar/download-tool/download-chart/apply-download-style/create-cssrule";

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
  if (source.tagName === 'text') {
    //Check if text elements use 'transform-box' and 'transform-origin'
    //If so, include them as inline styles
    const svgTransformStyles = elementComputedStyleWithoutDefaults(source, elementSVGTransformStyles);
    if ('transform-origin' in svgTransformStyles && 'transform-box' in svgTransformStyles) {
      target.style['transform-origin'] = svgTransformStyles['transform-origin']
      target.style['transform-box'] = svgTransformStyles['transform-box']
    }
  }
  for (let i = 0; i < source.children.length; ++i) {
    const child = target.children[i] as (SVGElement | HTMLElement)
    attrsFromComputedStyle(child, source.children[i]);
  }
}
