import gulp from "gulp";
import {dataPaths} from "./copy-path-data";
import {dependencyBasedLibPaths, libsPaths} from "./copy-path-libs";
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
