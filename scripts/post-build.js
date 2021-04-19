const path = require('path');
const fs = require('fs');

const pathToHtml = path.resolve(__dirname, '..', 'dist', 'index.html');

const html = fs.readFileSync(pathToHtml, 'utf8');

const newHtml = html.replace(/"\/assets/g, '"assets');

fs.writeFileSync(pathToHtml, newHtml);