var tocbot = require('tocbot');
var $ = require('jquery');

tocbot.init({
    tocSelector: '.js-toc',
    // Where to grab the headings to build the table of contents.
    contentSelector: '#main-text',
    // Which headings to grab inside of the contentSelector element.
    headingSelector: 'h1, h2, h3',

    //positionFixedClass: 'toc-container'
});

var stickyOffset = $('.toc-container').offset().top;
var stickyOffset = 242;

$(window).scroll(function(){
  
  var sticky = $('.toc-container'),
      scroll = $(window).scrollTop();

  if (scroll >= stickyOffset) sticky.addClass('fixed');
  else sticky.removeClass('fixed');
});

