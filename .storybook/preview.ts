import type {Preview} from "@storybook/html";
// import {IndexEntry} from '@storybook/types'
import '../package/respvis.css'
import '../src/stories/global/general.css'
import '../src/stories/global/chart-window.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: (a, b) => {
        return a.id === b.id ? 0 : -1 * a.id.localeCompare(b.id, undefined, { numeric: true })
      },
    },
  },
};

export default preview;
