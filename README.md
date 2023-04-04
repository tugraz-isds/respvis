# RespVis

The goal of this framework is to make building responsive
visualisations as easy as possible while also providing mechanisms for
powerful customisation and extensibility. This is achieved by merging
SVG-based components with a layouting engine based on the CSS grid
syntax.

A live version of the `master` branch can be found at
[respvis.netlify.app](https://respvis.netlify.app/).

A live version of the current `develop` branch can be found at
[respvis-dev.netlify.app](https://respvis-dev.netlify.app/).

# Commands

## Installing

The framework is built on the Node ecosystem. Before attempting to do
anything else, all the dependencies need to be installed:

```
npm install
```

## Building

Gulp is used to automate repeatable tasks. The build task creates a
new build of the framework and the examples into the `dist` folder:

```
gulp build  // Using globally installed gulp

npx gulp build  // Using locally packaged gulp

npm run build // Using package build script
```

To test a built version you have to deploy the `dist` folder to a web
server, or open the `dist/index.html` file directly in a browser (make
sure your browser CORS policy [allows local file
requests](https://dev.to/dengel29/loading-local-files-in-firefox-and-chrome-m9f)).


## Development

For development it is often useful to automatically rebuild and reload
an app. This framework uses Browsersync to implement this and the
command to run a hot-reloadable live server is:

```
gulp serve  // Using globally installed gulp

npx gulp serve  // Using locally packaged gulp

npm run start // Using package build script
```

or simply:

```
gulp  // Using globally installed gulp

npx gulp  // Using locally packaged gulp

npm start // Using package build script
```
