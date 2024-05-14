import path from "path";
import {createPaths} from "./create-paths";

const rootDir = path.dirname(path.dirname(__dirname))
  .split(path.sep).join(path.posix.sep)

export const absolutePaths = createPaths(rootDir)
