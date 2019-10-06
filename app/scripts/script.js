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
txlist = document.getElementsByTagName("dtex");
for (var i = 0; i < txlist.length; i++) {
    var tx = txlist[i];
    var txtext = "\\displaystyle " + tx.textContent;
    var html = katex.renderToString(txtext, tx, { displayMode: true });
    html = "<div style='text-align:left;margin-bottom:1em;'>" + html
               + "<span style='float:right'>(" + (i+1) + ")</span></div>";
    tx.innerHTML = html;
}

// Collapibles
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}

