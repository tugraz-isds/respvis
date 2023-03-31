// # Setup
const gulp = require('gulp');

// ## Rollup
const rollup = require('rollup');
const rollupCommonJs = require('@rollup/plugin-commonjs');
const rollupNodeResolve = require('@rollup/plugin-node-resolve').default;
const rollupTypescript = require('@rollup/plugin-typescript');
const rollupTerser = require('rollup-plugin-terser').terser;
const rollupGzip = require('rollup-plugin-gzip').default;

// ## BrowserSync
const browserSync = require('browser-sync').create();

// ## Utilities
const del = require('del');
const rename = require('gulp-rename');
const path = require('path');



// # Private tasks

// ## Bundle JS

async function bundleJSDevelopment() {
  await bundleJS("development")
}

async function bundleJSProduction() {
  await bundleJS("production")
}
async function bundleJS(mode) {
  const bundle = await rollup.rollup({
    input: 'src/lib/index.ts',
    plugins: [rollupNodeResolve({ browser: true }), rollupCommonJs(), rollupTypescript()],
  });

  const minPlugins = [rollupTerser()];
  const gzPlugins = [rollupTerser(), rollupGzip()];

  function write(props) {
      const {format, location = `dist/respvis/${format}`} = props
      const writeConfigurationsIIFE = [
          { extension: 'js', plugins: [] },
          { extension: 'min.js', plugins: minPlugins },
          { extension: 'min.js', plugins: gzPlugins },
      ];
      return writeConfigurationsIIFE.map((c) =>
          bundle.write({
              file:`${location}/respvis.${c.extension}`,
              format: c.format,
              name: 'respVis',
              plugins: c.plugins,
              sourcemap: true,
          })
      )
  }

  const respVisLibWrites = [write({format: 'iife'}), write({format: 'es'}), write({format: 'cjs'})]

  return Promise.all([
    write({format: 'es', location: `dist/examples/libs/respvis`}), //Only do respvis writes in production mode to save time during development
    mode === 'production' ? respVisLibWrites : undefined
  ]);
}

function bundleCSS() {
  return gulp.src('./src/respvis.css').pipe(gulp.dest('./dist'));
}

function copyExamples() {
  return gulp.src('./src/examples/**/*').pipe(gulp.dest('./dist/examples'));
}

function copyExamplesRedirect() {
  return gulp.src('./src/index.html').pipe(gulp.dest('./dist'));
}

// ## Reload browser
function reloadBrowser(cb) {
  browserSync.reload();
  cb();
}

// ## Clean
function cleanDist() {
  return del('dist', { force: true });
}

function cleanNodeModules() {
  return del('node_modules', { force: true });
}

// ## Live Update File Changes in Examples
function updateDistForServe(filename) {
    updateSingleExampleFile(filename) //gulp.series not possible in watch callback?
    browserSync.reload();
}

function updateSingleExampleFile(fileName) {
    const sameFilePath = fileName.substring(4)
    const targetFolder = path.dirname(sameFilePath)
    gulp.src(`./src/${sameFilePath}`).pipe(gulp.dest(`./dist/${targetFolder}`));
}



// # Public tasks

exports.clean = cleanDist;

exports.cleanAll = gulp.series(cleanDist, cleanNodeModules);

exports.build = gulp.series(
  exports.clean,
  copyExamples, // must be done before bundleJS to replace proxy respvis.js in src/examples/libs/respvis/respvis.js
  gulp.parallel(bundleJSProduction, bundleCSS, copyExamplesRedirect),
);


exports.serve = gulp.series(exports.build, watch)

function watch(cb) {
  browserSync.init({
    server: './dist',
    startPath: '/',
  });

  const watchOptions = { ignoreInitial: true };
  gulp.watch('./src/lib/**/*', watchOptions, gulp.series(bundleJSDevelopment, reloadBrowser));
  gulp.watch('./src/respvis.css', watchOptions, gulp.series(bundleCSS, reloadBrowser));

  const examplesWatcher = gulp.watch('./src/examples/**/*', watchOptions);
  examplesWatcher.on('change', updateDistForServe)

  cb()
}

exports.default = exports.serve;
