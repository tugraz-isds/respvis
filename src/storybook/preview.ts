import type {Preview} from "@storybook/html";
import ChartDocTemplate from './stories/util/templates/ChartDocTemplate.mdx'
import {INITIAL_VIEWPORTS} from "@storybook/addon-viewport"
import '../../package/respvis.css'
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
          'RespVis',
          'Changelog',
          'Future Outlook',
          'Using RespVis',
          [
            'Using RespVis',
            'Packages',
            'Charts',
            [
              'Charts',
              'Chart Examples',
              [
                'Chart Examples',
                [
                  'Cartesian Charts',
                  [
                    'Line Charts',
                    ['Single Line Chart', 'Multi Line Chart', '*'],
                    'Bar Charts',
                    ['Standard Bar Chart', 'Grouped Bar Chart', 'Stacked Bar Chart', '*'],
                    'Scatterplot',
                    '*'
                  ],
                  '*'
                ],
                '*'
              ],
              'Extending Charts',
              '*'
            ],
            'Layouting Mechanism',
            'Layout Breakpoints',
            'Layouting SVG Text',
            'CSS Caveats',
          ],
          'Contributing',
          [
            'Contributing',
            'Development Environment',
            'Project Structure',
            'Contribution Guidelines',
            'Deployment',
            '*'
          ],
          'Arguments',
          ['Arguments', '*'],
          '*']
      }
    },
    viewport: {
      viewports: INITIAL_VIEWPORTS
    },
    docs: {
      page: ChartDocTemplate,
      // theme: themes.dark
    }
  },
};

export default preview;
