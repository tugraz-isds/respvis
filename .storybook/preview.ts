import type {Preview} from "@storybook/html";
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
  },
};

export default preview;
