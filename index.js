var path = require('path');
var fs = require('fs');
var html = require('html');

var updatedPages = [];

function getTargetHtmlPath(mdPath) {
  var mdInfo = path.parse(mdPath);
  var targetFile = mdInfo.base.replace(".md", ".html");

  if (mdInfo.base == "README.md") {
    targetFile = "index.html";
  }

  var relpath = path.join("./", "_book", mdInfo.dir, targetFile);
  return path.resolve(relpath);
}

function prettify(str) {
  return html.prettyPrint(str);
}

function prettifyFile(filename) {
  fs.writeFileSync(filename, prettify(fs.readFileSync(filename).toString()));
}

module.exports = {
  book: {},
  hooks: {
    "page": function (page) {
      updatedPages.push(page.path);
      return page;
    },
    "finish": function() {
      console.log("Current Directory");
      console.log(process.cwd());

      for (var i=0; i < updatedPages.length; i++) {
        var hPath = getTargetHtmlPath(updatedPages[i]);
        prettifyFile(hPath);
      }

      updatedPages = [];
    }
  }
};
