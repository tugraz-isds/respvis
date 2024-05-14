import del from "del";
import {libsPaths} from "./copy-example-dependencies/copyPathLibs";
import {dataPaths} from "./copy-example-dependencies/copyPathData";
import {absolutePaths} from "./paths/absolute-paths";

const {gulpUtilGenerated} = absolutePaths

export function cleanExampleDependencies() {
  const delDataTargetDirs = del(dataPaths.map(dataPath => dataPath.target).flat(), { force: true })
  const delLibsTargetDirs = del(libsPaths.map(libPath => libPath.target).flat(), { force: true })
  const delSourceDirs = del([gulpUtilGenerated], { force: true })
  return Promise.all([delDataTargetDirs, delLibsTargetDirs, delSourceDirs])
}
