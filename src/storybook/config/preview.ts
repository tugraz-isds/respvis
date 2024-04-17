import type {Preview} from "@storybook/html";
import ChartDocTemplate from '../stories/templates/ChartDocTemplate.mdx'
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
      storySort: {
        order: ['Charts', 'Chart-Components', '*']
      }
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
