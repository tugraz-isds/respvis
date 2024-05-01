import type {Preview} from "@storybook/html";
import ChartDocTemplate from '../stories/templates/ChartDocTemplate.mdx'
import {INITIAL_VIEWPORTS} from "@storybook/addon-viewport"
import '../../../package/respvis.css'
import '../stories/story-styles/general.css'
import '../stories/story-styles/chart-window.css'

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
        order: [
          'Charts',
          [
            'About Chart Stories',
            'Line Charts',
            ['Single Line Chart', 'Multi Line Chart', '*'],
            'Bar Charts',
            ['Standard Bar Chart', 'Grouped Bar Chart', 'Stacked Bar Chart', '*'],
            'Scatterplot',
            '*'],
          'Chart-Components',
          '*']
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
