import React, {FC, useContext} from 'react';
import {DocsContext} from "@storybook/blocks";
import {SourceCollapseBlock} from "./SourceCollapseBlock/SourceCollapseBlock";
import {StoryContext} from "@storybook/html";

interface StoriesProps {
  includePrimary?: boolean;
}

export const SourceCollapseBlocks: FC<StoriesProps> = ({includePrimary = true}) => {
  const {componentStories, projectAnnotations, getStoryContext} = useContext(DocsContext);
  let stories = componentStories();
  const {stories: {filter} = {filter: undefined}} = projectAnnotations.parameters?.docs || {};
  if (filter) {
    stories = stories.filter((story) => filter(story, getStoryContext(story)));
  }

  // console.log(storyIdToCSFFile) //useContext(DocsContext)
  // stories.forEach((story, index) => {
  //   if (index === 0) {
  //     console.log(story)
  //   }
  // })

  if (!includePrimary) stories = stories.slice(1);

  if (!stories || stories.length === 0) {
    return null;
  }
  return (
    <>
      {stories.map(
        (story) => {
          //How to properly cast type?
          return story && <SourceCollapseBlock key={story.id} story={story as unknown as StoryContext}></SourceCollapseBlock>
        }
      )}
    </>
  );
};
