import gulp from "gulp";
import {dataPaths} from "./copyPathData";
import {dependencyBasedLibPaths, libsPaths} from "./copyPathLibs";
import mergeStream from "merge-stream";

//TODO: type for srcTargetsMapping
function copyFiles(srcTargetsMapping: any) {
  return srcTargetsMapping.map(mapping => {
    return mapping.target.map((target) => gulp.src(mapping.src).pipe(gulp.dest(target)))
  }).flat()
}

export function copyExampleDependencies() {
  return mergeStream([...copyFiles(dataPaths), ...copyFiles(libsPaths),
    ...copyFiles(dependencyBasedLibPaths)
  ])
}
