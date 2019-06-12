var tocbot = require('tocbot');
var $ = require('jquery');

console.log("test");
tocbot.init({
    tocSelector: '.js-toc',
    contentSelector: '#body',
    headingSelector: 'h1, h2, h3, h4',
    orderedList: false
});

$(window).scroll(function(){

    var stickyOffset = $('.logo-container').offset().top + $('.logo-container').height() - $('.navbar-background').height();
    var sticky = $('.sticky'),
        scroll = $(window).scrollTop();

    if (scroll >= stickyOffset) sticky.addClass('fixed');
    else sticky.removeClass('fixed');
});

