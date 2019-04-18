var tocbot = require('tocbot');
tocbot.init({
tocSelector: '.js-toc',
// Where to grab the headings to build the table of contents.
contentSelector: '#main-text',
// Which headings to grab inside of the contentSelector element.
headingSelector: 'h1, h2, h3',
});




