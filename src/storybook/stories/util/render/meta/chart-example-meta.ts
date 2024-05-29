import {rawCode} from "storybook-util/raw-code";

export const chartExampleMeta = {
  parameters: {
    docs: {
      story: {
        inline: false,
        height: 500
      },
    },
    sources: {
      js: { title: 'JS Code', code: (args: object) => rawCode({args}) }
    }
  },
}
