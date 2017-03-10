var fs = require('fs');
var inline = require('inline-critical');
var path = require('path');

const buildDir = path(__dirname, 'build');
const files = ['circle', 'faq', 'index', 'levels'];
const critical = fs.readFileSync(path.join(__dirname, 'source', 'css', 'styles.css'), 'utf-8');

files.forEach(file => {
  const html = path.resolve(buildDir, `${file}.html`);

  const inlined = inline(html, critical, {
    minify: true,
    extract: false
  });

  fs.writeFileSync(html, inlined);
});
