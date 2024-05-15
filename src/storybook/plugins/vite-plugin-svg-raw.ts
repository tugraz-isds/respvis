import fs from "fs";
import path from "path";

export function svgRawPlugin() {
  return {
    name: 'vite-plugin-svg-raw',
    async transform(code, id) {
      if (path.extname(id) === '.svg') {
        const svgContent = await fs.promises.readFile(id, 'utf-8');
        return `export default ${JSON.stringify(svgContent)}`;
      }
    }
  };
}
