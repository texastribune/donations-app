const fs = require('fs');
const inline = require('inline-critical');
const path = require('path');
const glob = require('glob');

const buildDir = path.join(__dirname, '..', 'build');

glob(`${buildDir}/css/*.css`, (err, cssFiles) => {
  if (cssFiles.length !== 1) {
    return false;
  }

  const cssFile = cssFiles[0];

  glob(`${buildDir}/*.html`, (err, htmlFiles) => {
    htmlFiles.forEach(htmlFile => {
      const htmlContents = fs.readFileSync(htmlFile);
      const cssContents = fs.readFileSync(cssFile);
      const inlined = inline(htmlContents, cssContents, {
        minify: true,
        extract: false
      });

      fs.writeFileSync(htmlFile, inlined);
    });
  });
});
