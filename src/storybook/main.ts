import type {StorybookConfig} from "@storybook/html-vite";
import {svgRawPlugin} from './plugins/vite-plugin-svg-raw';
import tsconfigPaths from 'vite-tsconfig-paths'
// import remarkGfm from 'remark-gfm';

const config: StorybookConfig = {
  stories: ["./stories/**/*.mdx", "./stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    '@storybook/addon-storysource',
    // {
    //   name: '@storybook/addon-docs',
    //   options: {
    //     mdxPluginOptions: {
    //       mdxCompileOptions: {
    //         remarkPlugins: [remarkGfm],
    //       },
    //     },
    //   },
    // },
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
      ]
    });
  },
};
export default config;
