var tocbot = require('tocbot');
var $ = require('jquery');
var katex = require('katex');

// Table of Contents
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


// Maths
var x = document.getElementsByClassName('maths');
for (var i = 0; i < x.length; i++) {
    console.log("test");
    try {
        if(x[i].tagName == "DIV"){
            t= katex.render(x[i].textContent,x[i],{ displayMode: true });
        } else {

            t= katex.render(x[i].textContent,x[i]);
        }
    }
    catch(err) {
        x[i].style.color = 'red';
        x[i].textContent= err;
    }
}

