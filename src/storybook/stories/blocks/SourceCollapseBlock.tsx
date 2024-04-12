import {Canvas, SourceProps} from '@storybook/blocks';
import React, {useState} from "react";

type Language = {
  code: string,
  title?: string
}
type Sources = Record<string, Language>
/**
 */
type SourceCollapseBlockProps = SourceProps & {
  of: any //TODO: only stories allowed
}
export const SourceCollapseBlock = (props: SourceCollapseBlockProps) => {
  const {of} = props
  const sources: Sources = of.parameters.sources //'css' | 'js'
  const [currentCode, setCurrentCode] = useState(Object.keys(sources)[0])
  const code = of.parameters.sources[currentCode].code
  const language: any = currentCode
  const type: any = 'code'

  const actions = Object.entries(sources).map(([language, config]) => {
    return {
      title: config.title ?? language.toUpperCase(),
      onClick: () => setCurrentCode(language)
    }
  })

  return <Canvas of={of} source={{code, language, type}} className={''} additionalActions={actions}></Canvas>
};
