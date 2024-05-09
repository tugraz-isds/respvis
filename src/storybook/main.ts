import type {StorybookConfig} from "@storybook/html-vite";
import svgRawPlugin from './plugins/vite-plugin-svg-raw.js';
import tsconfigPaths from 'vite-tsconfig-paths'

const config: StorybookConfig = {
  stories: ["./stories/**/*.mdx", "./stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    '@storybook/addon-storysource'
  ],
  framework: {
    name: "@storybook/html-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  async viteFinal(config) {
    // Merge custom configuration into the default config
    const { mergeConfig } = await import('vite');

    return mergeConfig(config, {
      // Add dependencies to pre-optimization
      optimizeDeps: {
        include: ['storybook-dark-mode'],
      },
      plugins: [
        svgRawPlugin(),
        tsconfigPaths({
        })
      ]
    });
  },
};
export default config;
