import type {Preview} from "@storybook/html";
import ChartDocTemplate from '../stories/templates/ChartDocTemplate.mdx'
// import {IndexEntry} from '@storybook/types'
import {INITIAL_VIEWPORTS} from "@storybook/addon-viewport"
import '../../../package/respvis.css'
import '../stories/global/general.css'
import '../stories/global/chart-window.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      // storySort: (a, b) => {
      //   return a.id === b.id ? 0 : -1 * a.id.localeCompare(b.id, undefined, { numeric: true })
      // },
    },
    viewport: {
      viewports: INITIAL_VIEWPORTS
    },
    docs: {
      page: ChartDocTemplate,
    }
  },
};

export default preview;
