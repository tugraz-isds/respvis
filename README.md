# RespVis

The RespVis framework demonstrates how to build responsive
visualisations by implementing some common responsive patterns,
such as rotating axis tick labels or flipping a chart to extend
vertically rather than horizontally.
In addition, RespVis provides its own layouting mechanism for SVG
chart components (title, x-axis, y-axis, legend, etc.), using standard
CSS Grid or Flexbox syntax.

A live version of the `master` branch can be found at
[respvis.netlify.app](https://respvis.netlify.app/).

A live version of the current `develop` branch can be found at
[respvis-dev.netlify.app](https://respvis-dev.netlify.app/).


***

# Commands

## Installing

The framework is built on the Node ecosystem. Before attempting to do
anything else, all the dependencies need to be installed:

```
npm install
```

## Gulp Build And Development

Gulp is used to automate repeatable tasks. The file [gulpfile.js](gulpfile.js)
defines six public tasks:

- The `clean` task removes existing `package` and `dist` directories in
  order to enable a clean rebuild of the project.

- The `cleanExampleDeps` task removes dependencies which were copied from 
  `example-dependencies` to `src/examples/**`. The process of copying
  these dependencies is necessary to keep control over all dependencies
  in one place and to avoid muliple slighly different versions of e.g. the
  same data file or library.

- The `cleanAll` task executes the `clean` task, `cleanExampleDeps` task  
  and additionally removes the `node_modules` directory and 
  `package-lock.json` in order to enable a clean rebuild of the project including 
  the re-installation of dependencies.

- The `build` task first executes the clean task, then creates a new
  build of the framework and copies the self-contained examples into
  the freshly created `dist` folder. The build task, in contrary to
  the serve task, bundles all modules respvis provides, once in standalone form,
  and once in dependency-based form.

- The `serve` task first executes the build task, then additionally
  executes a private task called watcher which has two
  responsibilities: First, the browser-sync package is used to
  initialise a live server which serves the `dist` directory. Then,
  file watchers are initiated which automatically update the `dist`
  folder when making any relevant changes in the `src` folder and
  notify browsers to reload the page. The serve task can be invoked 
  in production (--prod) or developer (--dev) mode. The default is
  production mode. The non-secret enviroment variables for production and
  development can be found in `.env.prod` and `.env.dev` respectively.
  Note that the serve tasks only bundles the standalone form of respvis,
  as this package is the only one needed for the self-contained examples
  and omitting the bundling of the other modules saves much time during
  live development.

- The `genSVGDataURI` task converts svg files which are
  meant to be used as icons automatically to data URIs that can be
  conveniently copied and pasted into style sheets. This is especially
  helpful when creating styles for cursor icons.

The public tasks can be invoked either by directly running gulp via npx or
by running the equivalent scripts in package.json:

```
npm run clean
npx gulp clean

npm run cleanExampleDeps
npx gulp cleanExampleDeps

npm run cleanAll
npx gulp cleanAll

npm run build
npx gulp build

npm run serve-dev
npx gulp serve --dev

npm run serve-prod
npx gulp serve --prod

npm run genSVGDataURI
npx gulp genSVGDataURI
```

***

# Documentation And Testing

The famous frontend workshop Storybook is used to provide extensive
documentation about RespVis. When running storybook one can conveniently
navigate through different use cases of different RespVis components. On
top of that there are many markdown files explaining the functionality of
RespVis in depth. To run storybook one must execute the following command:

```
npm run storybook
```

***

# Workflow

All the RespVis [examples](src/examples) are fully self-contained.
All the files necessary for serving each example chart are included
in its folder after building in the dist folder.

The folder [src/examples-dependencies](src/examples-dependencies)
holds dependencies which could be of interest for all examples, for
example, datasets, default styles, and library bundles. When the
build task is executed, all necessary files are copied into the right
place for the examples in the dist folder.

Generated files are not meant to be pushed to the repository, and
are therefore included in the .gitignore file. When adding new chart
examples or data it is important to keep this in mind and update the
[Paths](gulp-tasks/paths.js) and [Path
Mappings](gulp-tasks/copyPathData.js) accordingly. These are part of
the [subtasks](gulp-tasks) of gulp. Changes to the subtasks will
influence which files are generated by gulp and where.




## Example Chart Folder and File Structure

The following file structure must be applied when adding a new chart
to [examples](src/examples) in order to achieve a unified consistent
set (files generated by gulp are marked):

```
├── <chart>
│   ├── <chart>.css
│   ├── <chart>.html
│   ├── <chart>.scss
│   ├── chooseResponsiveData.js
│   ├── data (generated)
│   │   ├── <dataset>.js (generated)
│   │   └── source.txt (generated)
│   ├── libs (generated)
│   │   ├── d3-7.6.0 (generated)
│   │   │   ├── d3.js (generated)
│   │   │   ├── d3.min.js (generated)
│   │   │   └── LICENSE (generated)
│   │   └── respvis (generated)
│   │       └── respvis.js (generated)
│   └── styles (generated)
│       └── respvis.css (generated)
```



## Development File Structure

The following file structure gives an overview of the gulp
tasks. Tasks which must be adapted when adding new chart examples are
marked accordingly (files generated by gulp are marked):

```
├── gulp-tasks
│   ├── buildSCSS.js
│   ├── bundleDeclaration.js
│   ├── bundleJS.js
│   ├── copyExampleDependencies.js
│   ├── copyExamples.js
│   ├── copyPathData.js (add new copy data tasks here)
│   ├── copyPathLibs.js
│   ├── copyPathStyles.js
│   ├── createExampleDependencies.js
│   ├── paths.js (add new example paths here)
│   └── watcher.js
├── src
│   ├── examples-dependencies
│   │   ├── data
│   │   │   ├── <dataset> (when adding a new dataset follow this schema)
│   │   │   │   ├── <dataset>.js
│   │   │   │   └── source.txt
│   │   ├── libs (generated)
│   │   │   ├── d3-7.6.0 (generated)
│   │   │   │   ├── d3.js (generated)
│   │   │   │   ├── d3.min.js (generated)
│   │   │   │   └── LICENSE (generated)
│   │   │   └── respvis (generated)
│   │   │       └── respvis.js (generated)
│   │   └── styles (generated)
│   │       └── respvis.css (generated)
```



## Deployment

There are several ways to try out a built version of
the RespVis examples:

- Copy the `dist` folder to a web server's webspace.

- Start a local web server in the `dist` folder with a command like:
```
python3 -m http.server 8000
```
and point a web browser to [localhost:8000](http://localhost:8000/).

- Open the `dist/index.html` file directly in a browser (make
  sure your browser CORS policy [allows local file
requests](https://dev.to/dengel29/loading-local-files-in-firefox-and-chrome-m9f)).



***

# Contributors

The following people have contributed to RespVis:

- Keith Andrews
  [kandrews@iicm.edu](mailto:kandrews@iicm.edu?subject=RespVis)  
  Project leader.

- David Egger  
  Master's Thesis, main developer.

- Peter Oberrauner  
  [Master's Thesis](https://ftp.isds.tugraz.at/pub/theses/poberrauner-2022-msc.pdf),
  original developer.

