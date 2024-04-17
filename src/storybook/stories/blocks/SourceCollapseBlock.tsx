import {Canvas, DocsContext, SourceProps} from '@storybook/blocks';
import React, {useContext, useState} from "react";

type Language = {
  code: string | string[] | ((args: object) => string),
  title?: string
}
type Sources = Record<string, Language>
/**
 */
type SourceCollapseBlockProps = SourceProps & {
  of: any //TODO: only stories allowed
  id: any
}
export const SourceCollapseBlock = (props: SourceCollapseBlockProps) => {
  const {of, id} = props
  //@ts-ignore
  const storyIdToCSFFile: Map<string, any> = useContext(DocsContext).storyIdToCSFFile;
  const csfFile = storyIdToCSFFile?.get(id)
  const meta = csfFile?.meta

  const sources: Sources = {
    ...meta?.parameters?.sources,
    ...of.parameters.sources
  }//'css' | 'js'
  const [currentCode, setCurrentCode] = useState(Object.keys(sources)[0] ?? '')

  const source: any = {
    code: parseCode(sources[currentCode]?.code), //TODO: handle possible code arrays here
    type: 'code',
    language: currentCode
  }

  function parseCode(code?: string | string[] | Function) {
    if (!code) return ''
    if (Array.isArray(code)) return code.join('\n')
    if (typeof code === 'string') return code
    return code(of.args)
  }

  const actions = Object.entries(sources).map(([language, config]) => {
    return {
      title: config.title ?? language.toUpperCase(),
      onClick: () => setCurrentCode(language)
    }
  })

  return <Canvas of={of} source={source} className={''} additionalActions={actions}></Canvas>
};
