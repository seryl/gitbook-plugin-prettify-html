import path from 'path';
import fs from 'fs';
import html from 'html';
import cheerio from 'cheerio';

var updatedPages = [];

// Can be overridden with the key pluginsConfig.prettify-html
var prettyConfig = {
  "indent_size": 2,
  "unformatted": ["code"]
};

function getTargetHtmlPath(mdPath) {
  var mdInfo = path.parse(mdPath);
  var targetFile = mdInfo.base.replace(".md", ".html");

  if (mdInfo.base == "README.md") {
    targetFile = "index.html";
  }

  var relpath = path.join("./", "_book", mdInfo.dir, targetFile);
  return path.resolve(relpath);
}

function removePreWhitespace(str) {
  var crio = cheerio.load(str), i;
  crio('pre').each( (i, elem) => {
    elem.text(elem.text().trim());
  });

  return crio.html();
}

function prettify(str) {
  var updated = html.prettyPrint(str, prettyConfig);
  updated = removePreWhitespace(updated);
  return updated;
}

function prettifyFile(filename) {
  fs.writeFileSync(filename, prettify(fs.readFileSync(filename).toString()));
}

module.exports = {
  book: {},
  hooks: {
    "config": function(config) {
      if (config["prettify-html"] != undefined) {
        prettyConfig = config["prettify-html"];
      }
      return config;
    },
    "page": function (page) {
      updatedPages.push(page.path);
      return page;
    },
    "finish": function() {
      for (var i=0; i < updatedPages.length; i++) {
        var hPath = getTargetHtmlPath(updatedPages[i]);
        prettifyFile(hPath);
      }

      updatedPages = [];
    }
  }
};
