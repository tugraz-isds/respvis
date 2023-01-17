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

async function bundleJS() {
  const bundle = await rollup.rollup({
    input: 'src/lib/index.ts',
    plugins: [rollupNodeResolve({ browser: true }), rollupCommonJs(), rollupTypescript()],
  });

  const minPlugins = [rollupTerser()];
  const gzPlugins = [rollupTerser(), rollupGzip()];
  const writeConfigurations = [
    { extension: 'js', format: 'iife', plugins: [] },
    { extension: 'min.js', format: 'iife', plugins: minPlugins },
    { extension: 'min.js', format: 'iife', plugins: gzPlugins },
    { extension: 'mjs', format: 'es', plugins: [] },
    { extension: 'min.mjs', format: 'es', plugins: minPlugins },
    { extension: 'min.mjs', format: 'es', plugins: gzPlugins },
  ];

  const writeConfigurationsModuleInJs = [
    { extension: 'js', format: 'es', plugins: [] },
    { extension: 'min.js', format: 'es', plugins: minPlugins },
    { extension: 'min.js', format: 'es', plugins: gzPlugins },
  ]

  const standardOutput = writeConfigurations.map((c) =>
      bundle.write({
        file: `dist/respvis.${c.extension}`,
        format: c.format,
        name: 'respVis',
        plugins: c.plugins,
        sourcemap: true,
      })
  )

  const moduleInJsOutput = writeConfigurationsModuleInJs.map((c) =>
      bundle.write({
        file: `dist/moduleInJs/respvis.${c.extension}`,
        format: c.format,
        name: 'respVis',
        plugins: c.plugins,
        sourcemap: true,
      })
  )

  return Promise.all(
      [...standardOutput, moduleInJsOutput]
  );
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

// # Public tasks

exports.clean = cleanDist;

exports.cleanAll = gulp.series([cleanDist, cleanNodeModules]);

exports.build = gulp.series([
  exports.clean,
  gulp.parallel([bundleJS, bundleCSS, copyExamples, copyExamplesRedirect]),
]);

exports.serve = function serve() {
  browserSync.init({
    server: './dist',
    startPath: '/',
  });

  const watchOptions = { ignoreInitial: false };
  gulp.watch('./src/**/*.ts', watchOptions, gulp.series(bundleJS, reloadBrowser));
  gulp.watch('./src/respvis.css', watchOptions, gulp.series(bundleCSS, reloadBrowser));
  gulp.watch(
    './src/examples/**/*',
    watchOptions,
    gulp.series(copyExamples, copyExamplesRedirect, reloadBrowser)
  );
};

exports.default = exports.serve;
