import svgRawPlugin from './config/vite-plugin-svg-raw.js';
import tsconfigPaths from 'vite-tsconfig-paths'

export default {
  plugins: [
    svgRawPlugin(),
    tsconfigPaths({
    })
  ]
};
