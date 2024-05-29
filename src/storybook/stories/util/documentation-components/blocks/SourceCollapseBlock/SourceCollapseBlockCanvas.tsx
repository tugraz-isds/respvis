import {Canvas, Controls, DocsContext, SourceProps} from '@storybook/blocks';
import React, {Fragment, useContext, useState} from "react";
import './SourceCollapseBlock.css'

type Language = {
  code: string | string[] | ((args: object) => string),
  title?: string
}
type Sources = Record<string, Language>
/**
 */
type SourceCollapseBlockProps = SourceProps & {
  of: any //only stories allowed
  id: any
}
export const SourceCollapseBlockCanvas = (props: SourceCollapseBlockProps) => {
  const {of, id} = props
  //@ts-ignore
  const storyIdToCSFFile: Map<string, any> = useContext(DocsContext).storyIdToCSFFile;
  const csfFile = storyIdToCSFFile?.get(id)
  const meta = csfFile?.meta

  const sources: Sources = {
    ...meta?.parameters?.sources,
    ...of.parameters.sources
  }//'css' | 'js'
  const [blockState, setBlockState] = useState<{
    visible: '' | 'controls' | 'language',
    currentLanguage: string
  }>({
    visible: '',
    currentLanguage: Object.keys(sources)[0] ?? ''
  })

  const source: any = {
    code: parseCode(sources[blockState.currentLanguage]?.code),
    type: 'code',
    language: blockState.currentLanguage
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
      onClick: () => {
        setBlockState(prev => {
          const fromSameLanguage = prev.visible === 'language' && prev.currentLanguage === language
          const visible = fromSameLanguage ? '' : 'language'
          return {...prev, currentLanguage: language, visible}
        })
      }
    }
  })
  actions.push({
    title: 'Controls',
    onClick: () => {
      setBlockState((prev) => {
        const visible = prev.visible === 'controls' ? '' : 'controls'
        return {...prev, visible}
      })
    }
  })

  const controlsVisible = blockState.visible === 'controls'
  const sourceState = blockState.visible === 'language' ? 'shown' : 'hidden'

  return <Fragment>
    <Canvas of={of} source={source} className={`sb-canvas-wrapper ${sourceState}`} additionalActions={actions} sourceState={'shown'}></Canvas>
    <div className={`sb-controls-wrapper ${!controlsVisible ? 'hidden' : ''}`}>
      <Controls of={of}/>
    </div>
  </Fragment>
};
