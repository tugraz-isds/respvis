// # Setup
const gulp = require('gulp');
// ## Rollup
const rollup = require('rollup');
const rollupCommonJs = require('@rollup/plugin-commonjs');
const rollupNodeResolve = require('@rollup/plugin-node-resolve').default;
const rollupTypescript = require('@rollup/plugin-typescript');
const rollupTerser = require('rollup-plugin-terser').terser;
const rollupGzip = require('rollup-plugin-gzip').default;
const dts = require('rollup-plugin-dts')

// ## BrowserSync
const browserSync = require('browser-sync').create();

// ## Sass
const sass = require('gulp-sass')(require('sass'));

// ## Utilities
const del = require('del');
const rename = require('gulp-rename');
const path = require('path');
const fs = require('fs');
const {copyExampleDependencies} = require("./bundling/copyExampleDependencies");
const {createExampleDependencies} = require("./bundling/createExampleDependencies");



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
    plugins: [
      rollupNodeResolve({ browser: true }),
      rollupCommonJs(),
      rollupTypescript({ tsconfig: "./tsconfig.json" })
    ]
  });

  const minPlugins = [rollupTerser()];
  const gzPlugins = [rollupTerser(), rollupGzip()];

  function write(format) {
    const location = `package/${format}`
    const writeConfigurationsIIFE = [
        { extension: 'js', plugins: [] },
        { extension: 'min.js', plugins: minPlugins },
        { extension: 'min.js', plugins: gzPlugins },
    ];
    return writeConfigurationsIIFE.map((c) => bundle.write({
      file:`${location}/respvis.${c.extension}`,
      format,
      name: 'respVis',
      plugins: c.plugins,
      sourcemap: true,
    }).then(() => {
      const fileData = fs.readFileSync(`${location}/respvis.${c.extension}`, 'utf8');
      const formatString = format === 'iife' ? 'IIFE' :
        format === 'esm' ? 'ESM' :
          format === 'cjs' ? 'CommonJS' : ''
      const dataWithHeaderLine = `// RespVis version 2.0 ${formatString}\n` + fileData
      fs.writeFileSync(`${location}/respvis.${c.extension}`, dataWithHeaderLine, 'utf8');
    }))
  }

  return Promise.all([
    ...write('esm'),
    ...((mode === 'production') ? [write('iife'), write('cjs')] : [])
  ])
}

async function bundleDeclaration() {
  const bundle = await rollup.rollup({
    input: 'package/esm/types/index.d.ts',
    plugins: [dts.default()]
  });
  await bundle.write({
    file: "package/index.d.ts",
    format: "esm"
  })
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
    const fileNamePosix = fileName.split(path.sep).join(path.posix.sep);
    const sameFilePath = fileNamePosix.substring(4)
    const targetFolder = path.dirname(sameFilePath)
    gulp.src(`./src/${sameFilePath}`).pipe(gulp.dest(`./dist/${targetFolder}/`));
}

async function compileSCSSToCSS(filename) {
  const fileNamePosix = filename.split(path.sep).join(path.posix.sep)
  const dirNamePosix = path.dirname(fileNamePosix)
  const cssFilePosix = fileNamePosix.substring(0, fileNamePosix.length - 4) + 'css';
  await del(cssFilePosix, { force: true })

  return {
    pipe: gulp.src(fileNamePosix)
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest(dirNamePosix)),
    cssFilePosix, dirNamePosix, fileNamePosix
  }
}

async function buildExamplesSCSS(filename) {
  const { pipe, cssFilePosix } = await compileSCSSToCSS(filename)
  pipe.on('end', () => {
    updateDistForServe(cssFilePosix)
  })
}

async function buildLibSCSS() {
  const { pipe } = await compileSCSSToCSS('./src/respvis.scss')
  pipe.on('end', () => {
    const cssPipe = bundleCSS()
    cssPipe.on('end', () => {
      browserSync.reload()
    })
  })
}

// # Public tasks

exports.clean = cleanDist;

exports.cleanAll = gulp.series(cleanDist, cleanNodeModules);

exports.build = gulp.series(
  exports.clean,
  copyExamples, // must be done before bundleJS to replace proxy respvis.js in src/examples/libs/respvis/respvis.js
  gulp.parallel(
    gulp.series(bundleJSProduction, bundleDeclaration),
    bundleCSS
  ),
  createExampleDependencies,
  copyExampleDependencies
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
  gulp.watch('./src/index.html', watchOptions, gulp.series(copyExamplesRedirect, reloadBrowser));

  const scssExamplesWatcher = gulp.watch('./src/examples/**/*.scss', watchOptions);
  scssExamplesWatcher.on('change', buildExamplesSCSS)

  const scssLibWatcher = gulp.watch(['./src/scss/**/*.scss', './src/*.scss'], watchOptions);
  scssLibWatcher.on('change', buildLibSCSS)

  const examplesWatcher = gulp.watch('./src/examples/**/!(*.css|*.scss)', watchOptions);
  examplesWatcher.on('change', updateDistForServe)
  examplesWatcher.on('add', updateDistForServe)
  examplesWatcher.on('addDir', updateDistForServe)
  cb()
}

exports.default = exports.serve;
