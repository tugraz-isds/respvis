import React, {FC, Fragment, useContext} from 'react';
import {Description, DocsContext, Subtitle} from "@storybook/blocks";
import {SourceCollapseBlock} from "./SourceCollapseBlock/SourceCollapseBlock";

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
        (story) =>
          story && <Fragment key={story.id}>
            <Subtitle children={story.name}/>
            <Description of={story}/>
            <SourceCollapseBlock of={story.moduleExport} id={story.id} __forceInitialArgs/>
          </Fragment>
      )}
    </>
  );
};
