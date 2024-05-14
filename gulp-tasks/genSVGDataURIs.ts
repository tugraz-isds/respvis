import gulp from "gulp";
import fs from "fs";
import svgToMiniDataURI from "mini-svg-data-uri";

export function genSVGDataURIs(svgGlob, outputDirectory) {
  const fileName = 'svg-uri-mapping.txt'
  const mapping = {}
  return new Promise((resolve, reject) => {
    gulp.src(svgGlob).on('data', (file) => {
      const svgFileName = file.relative;
      const normalString = file.contents.toString();
      const optimizedSVGDataURI = svgToMiniDataURI(normalString);
      const {width, height} = getSvgDimensions(normalString)
      const hotspotX = (width !== undefined) ? width / 2 : 0
      const hotspotY = (height !== undefined) ? height / 2 : 0
      mapping[svgFileName] = `url("${optimizedSVGDataURI}") ${hotspotX} ${hotspotY}, auto`
    }).on('error', () => {
      reject()
    }).on('end', () => {
        const lines = Object.entries(mapping).map(([key, value]) => {
          return key + ' : ' + value
        }).join('\n')
        if (!fs.existsSync(outputDirectory)) {
          fs.mkdirSync(outputDirectory, { recursive: true });
        }
        fs.writeFileSync(outputDirectory + '/' + fileName, lines , 'utf8');
        resolve({})
      })
  })
}

function getSvgDimensions(svgString) {
  const svgRegexWidth = /<svg[^>]*\swidth="([^"]*)"/i;
  const svgRegexHeight = /<svg[^>]*\sheight="([^"]*)"/i;
  const svgMatchWidth = svgString.match(svgRegexWidth);
  const svgMatchHeight = svgString.match(svgRegexHeight);
  if (!svgMatchWidth || svgMatchWidth.length < 2 || !svgMatchHeight || svgMatchHeight.length < 2)
    return {width: undefined, height: undefined}
  return {width: svgMatchWidth[1], height: svgMatchHeight[1]};
}
