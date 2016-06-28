var html = require('html');

module.exports = {
  book: {},
  hooks: {
    "page": function (page) {
      page.content = html.prettyPrint(page.content);
      return page;
    }
  }
};
