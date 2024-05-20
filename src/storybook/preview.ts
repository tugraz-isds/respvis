import type {Preview} from "@storybook/html";
import ChartDocTemplate from './stories/util/templates/ChartDocTemplate.mdx'
import {INITIAL_VIEWPORTS} from "@storybook/addon-viewport"
import '../../package/respvis/respvis.css'
import './stories/util/story-styles/general.css'
import './stories/util/story-styles/chart-window.css'

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
          'RespVis Packages',
          'RespVis Charts',
          'RespVis Layouting Mechanism',
          'Layout Breakpoints',
          'SVG Text in RespVis',
          'CSS Caveats',
          'Todos and Issues',
          'Charts',
          [
            'About Chart Stories',
            'Line Charts',
            ['Single Line Chart', 'Multi Line Chart', '*'],
            'Bar Charts',
            ['Standard Bar Chart', 'Grouped Bar Chart', 'Stacked Bar Chart', '*'],
            'Scatterplot',
            '*'],
          'Extending Charts',
          'RespVis Arguments',
          ['RespVis Arguments', '*'],
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
