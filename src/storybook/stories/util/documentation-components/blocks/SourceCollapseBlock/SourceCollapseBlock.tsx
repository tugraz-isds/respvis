import {Description, DocsContext, Subtitle} from "@storybook/blocks";
import {SourceCollapseBlockCanvas} from "./SourceCollapseBlockCanvas";
import React, {Fragment, useContext} from "react";
import {StoryContext, StoryObj} from "@storybook/html";


export const SourceCollapseBlock = (props: { story: StoryContext }) => {
  const {story} = props
  return <Fragment key={story.id}>
    <a id={"story-" + story.name.replace(/\s+/g, '-').toLowerCase()} target={'_self'}></a>
    <Subtitle children={story.name}/>
    <Description of={story}/>
    <SourceCollapseBlockCanvas of={story.moduleExport} id={story.id} __forceInitialArgs/>
  </Fragment>
}

export const SourceCollapseBlockByStoryObj = (props: { story: StoryObj }) => {
  const {story: storyArg} = props
  const {storyIdByName, storyById} = useContext(DocsContext);
  if (!storyArg.name) return null
  const storyId = storyIdByName(storyArg.name)
  const story = storyById(storyId)
  if (!story) {
    return null;
  }

  return <SourceCollapseBlock story={story as unknown as StoryContext}/>
}
