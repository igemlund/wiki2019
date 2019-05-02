var tocbot = require('tocbot');
var $ = require('jquery');

tocbot.init({
    tocSelector: '.js-toc',
    // Where to grab the headings to build the table of contents.
    contentSelector: '#main-text',
    // Which headings to grab inside of the contentSelector element.
    headingSelector: 'h2, h3, h4',

    //positionFixedClass: 'toc-container'
});


$(window).scroll(function(){

    var stickyOffset = $('#main-text').offset().top;
    var sticky = $('.sticky'),
        scroll = $(window).scrollTop();
    console.log(stickyOffset);
    console.log(scroll);

    if (scroll >= stickyOffset) sticky.addClass('fixed');
    else sticky.removeClass('fixed');
});

