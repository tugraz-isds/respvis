import type {StorybookConfig} from "@storybook/html-vite";
import {svgRawPlugin} from './plugins/vite-plugin-svg-raw';
import tsconfigPaths from 'vite-tsconfig-paths'

const config: StorybookConfig = {
  stories: ["./stories/**/*.mdx", "./stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  staticDirs: [{ from: './static-assets', to: '/assets' }],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    '@storybook/addon-storysource',
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
      plugins: [
        svgRawPlugin(),
        tsconfigPaths({})
      ],
      define: {
        '__RESPVIS_VERSION__': JSON.stringify(process.env.npm_package_version),
      }
    });
  },
};
export default config;
