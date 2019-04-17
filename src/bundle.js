(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * This file is responsible for building the DOM and updating DOM state.
 *
 * @author Tim Scanlin
 */

module.exports = function (options) {
  var forEach = [].forEach
  var some = [].some
  var body = document.body
  var currentlyHighlighting = true
  var SPACE_CHAR = ' '

  /**
   * Create link and list elements.
   * @param {Object} d
   * @param {HTMLElement} container
   * @return {HTMLElement}
   */
  function createEl (d, container) {
    var link = container.appendChild(createLink(d))
    if (d.children.length) {
      var list = createList(d.isCollapsed)
      d.children.forEach(function (child) {
        createEl(child, list)
      })
      link.appendChild(list)
    }
  }

  /**
   * Render nested heading array data into a given selector.
   * @param {String} selector
   * @param {Array} data
   * @return {HTMLElement}
   */
  function render (selector, data) {
    var collapsed = false
    var container = createList(collapsed)

    data.forEach(function (d) {
      createEl(d, container)
    })

    var parent = document.querySelector(selector)

    // Return if no parent is found.
    if (parent === null) {
      return
    }

    // Remove existing child if it exists.
    if (parent.firstChild) {
      parent.removeChild(parent.firstChild)
    }

    // Just return the parent and don't append the list if no links are found.
    if (data.length === 0) {
      return parent
    }

    // Append the Elements that have been created
    return parent.appendChild(container)
  }

  /**
   * Create link element.
   * @param {Object} data
   * @return {HTMLElement}
   */
  function createLink (data) {
    var item = document.createElement('li')
    var a = document.createElement('a')
    if (options.listItemClass) {
      item.setAttribute('class', options.listItemClass)
    }

    if (options.onClick) {
      a.onclick = options.onClick
    }

    if (options.includeHtml && data.childNodes.length) {
      forEach.call(data.childNodes, function (node) {
        a.appendChild(node.cloneNode(true))
      })
    } else {
      // Default behavior.
      a.textContent = data.textContent
    }
    a.setAttribute('href', '#' + data.id)
    a.setAttribute('class', options.linkClass +
      SPACE_CHAR + 'node-name--' + data.nodeName +
      SPACE_CHAR + options.extraLinkClasses)
    item.appendChild(a)
    return item
  }

  /**
   * Create list element.
   * @param {Boolean} isCollapsed
   * @return {HTMLElement}
   */
  function createList (isCollapsed) {
    var listElement = (options.orderedList) ? 'ol' : 'ul'
    var list = document.createElement(listElement)
    var classes = options.listClass +
      SPACE_CHAR + options.extraListClasses
    if (isCollapsed) {
      classes += SPACE_CHAR + options.collapsibleClass
      classes += SPACE_CHAR + options.isCollapsedClass
    }
    list.setAttribute('class', classes)
    return list
  }

  /**
   * Update fixed sidebar class.
   * @return {HTMLElement}
   */
  function updateFixedSidebarClass () {
    if (options.scrollContainer && document.querySelector(options.scrollContainer)) {
      var top = document.querySelector(options.scrollContainer).scrollTop
    } else {
      var top = document.documentElement.scrollTop || body.scrollTop
    }
    var posFixedEl = document.querySelector(options.positionFixedSelector)

    if (options.fixedSidebarOffset === 'auto') {
      options.fixedSidebarOffset = document.querySelector(options.tocSelector).offsetTop
    }

    if (top > options.fixedSidebarOffset) {
      if (posFixedEl.className.indexOf(options.positionFixedClass) === -1) {
        posFixedEl.className += SPACE_CHAR + options.positionFixedClass
      }
    } else {
      posFixedEl.className = posFixedEl.className.split(SPACE_CHAR + options.positionFixedClass).join('')
    }
  }

  /**
   * Get top position of heading
   * @param {HTMLElement}
   * @return {integer} position
   */
  function getHeadingTopPos (obj) {
    var position = 0
    if (obj != document.querySelector(options.contentSelector && obj != null)) {
      position = obj.offsetTop
      if (options.hasInnerContainers)
        position += getHeadingTopPos(obj.offsetParent)
    }
    return position
  }

  /**
   * Update TOC highlighting and collpased groupings.
   */
  function updateToc (headingsArray) {
    // If a fixed content container was set
    if (options.scrollContainer && document.querySelector(options.scrollContainer)) {
      var top = document.querySelector(options.scrollContainer).scrollTop
    } else {
      var top = document.documentElement.scrollTop || body.scrollTop
    }

    // Add fixed class at offset
    if (options.positionFixedSelector) {
      updateFixedSidebarClass()
    }

    // Get the top most heading currently visible on the page so we know what to highlight.
    var headings = headingsArray
    var topHeader
    // Using some instead of each so that we can escape early.
    if (currentlyHighlighting &&
      document.querySelector(options.tocSelector) !== null &&
      headings.length > 0) {
      some.call(headings, function (heading, i) {
        if (getHeadingTopPos(heading) > top + options.headingsOffset + 10) {
          // Don't allow negative index value.
          var index = (i === 0) ? i : i - 1
          topHeader = headings[index]
          return true
        } else if (i === headings.length - 1) {
          // This allows scrolling for the last heading on the page.
          topHeader = headings[headings.length - 1]
          return true
        }
      })

      // Remove the active class from the other tocLinks.
      var tocLinks = document.querySelector(options.tocSelector)
        .querySelectorAll('.' + options.linkClass)
      forEach.call(tocLinks, function (tocLink) {
        tocLink.className = tocLink.className.split(SPACE_CHAR + options.activeLinkClass).join('')
      })
      var tocLis = document.querySelector(options.tocSelector)
        .querySelectorAll('.' + options.listItemClass)
      forEach.call(tocLis, function (tocLi) {
        tocLi.className = tocLi.className.split(SPACE_CHAR + options.activeListItemClass).join('')
      })

      // Add the active class to the active tocLink.
      var activeTocLink = document.querySelector(options.tocSelector)
        .querySelector('.' + options.linkClass +
          '.node-name--' + topHeader.nodeName +
          '[href="#' + topHeader.id + '"]')
      if (activeTocLink.className.indexOf(options.activeLinkClass) === -1) {
        activeTocLink.className += SPACE_CHAR + options.activeLinkClass
      }
      var li = activeTocLink.parentNode
      if (li && li.className.indexOf(options.activeListItemClass) === -1) {
        li.className += SPACE_CHAR + options.activeListItemClass
      }

      var tocLists = document.querySelector(options.tocSelector)
        .querySelectorAll('.' + options.listClass + '.' + options.collapsibleClass)

      // Collapse the other collapsible lists.
      forEach.call(tocLists, function (list) {
        if (list.className.indexOf(options.isCollapsedClass) === -1) {
          list.className += SPACE_CHAR + options.isCollapsedClass
        }
      })

      // Expand the active link's collapsible list and its sibling if applicable.
      if (activeTocLink.nextSibling && activeTocLink.nextSibling.className.indexOf(options.isCollapsedClass) !== -1) {
        activeTocLink.nextSibling.className = activeTocLink.nextSibling.className.split(SPACE_CHAR + options.isCollapsedClass).join('')
      }
      removeCollapsedFromParents(activeTocLink.parentNode.parentNode)
    }
  }

  /**
   * Remove collpased class from parent elements.
   * @param {HTMLElement} element
   * @return {HTMLElement}
   */
  function removeCollapsedFromParents (element) {
    if (element.className.indexOf(options.collapsibleClass) !== -1 && element.className.indexOf(options.isCollapsedClass) !== -1) {
      element.className = element.className.split(SPACE_CHAR + options.isCollapsedClass).join('')
      return removeCollapsedFromParents(element.parentNode.parentNode)
    }
    return element
  }

  /**
   * Disable TOC Animation when a link is clicked.
   * @param {Event} event
   */
  function disableTocAnimation (event) {
    var target = event.target || event.srcElement
    if (typeof target.className !== 'string' || target.className.indexOf(options.linkClass) === -1) {
      return
    }
    // Bind to tocLink clicks to temporarily disable highlighting
    // while smoothScroll is animating.
    currentlyHighlighting = false
  }

  /**
   * Enable TOC Animation.
   */
  function enableTocAnimation () {
    currentlyHighlighting = true
  }

  return {
    enableTocAnimation: enableTocAnimation,
    disableTocAnimation: disableTocAnimation,
    render: render,
    updateToc: updateToc
  }
}

},{}],2:[function(require,module,exports){
module.exports = {
  // Where to render the table of contents.
  tocSelector: '.js-toc',
  // Where to grab the headings to build the table of contents.
  contentSelector: '.js-toc-content',
  // Which headings to grab inside of the contentSelector element.
  headingSelector: 'h1, h2, h3',
  // Headings that match the ignoreSelector will be skipped.
  ignoreSelector: '.js-toc-ignore',
  // For headings inside relative or absolute positioned containers within content
  hasInnerContainers: false,
  // Main class to add to links.
  linkClass: 'toc-link',
  // Extra classes to add to links.
  extraLinkClasses: '',
  // Class to add to active links,
  // the link corresponding to the top most heading on the page.
  activeLinkClass: 'is-active-link',
  // Main class to add to lists.
  listClass: 'toc-list',
  // Extra classes to add to lists.
  extraListClasses: '',
  // Class that gets added when a list should be collapsed.
  isCollapsedClass: 'is-collapsed',
  // Class that gets added when a list should be able
  // to be collapsed but isn't necessarily collpased.
  collapsibleClass: 'is-collapsible',
  // Class to add to list items.
  listItemClass: 'toc-list-item',
  // Class to add to active list items.
  activeListItemClass: 'is-active-li',
  // How many heading levels should not be collpased.
  // For example, number 6 will show everything since
  // there are only 6 heading levels and number 0 will collpase them all.
  // The sections that are hidden will open
  // and close as you scroll to headings within them.
  collapseDepth: 0,
  // Smooth scrolling enabled.
  scrollSmooth: true,
  // Smooth scroll duration.
  scrollSmoothDuration: 420,
  // Smooth scroll offset.
  scrollSmoothOffset: 0,
  // Callback for scroll end.
  scrollEndCallback: function (e) {},
  // Headings offset between the headings and the top of the document (this is meant for minor adjustments).
  headingsOffset: 1,
  // Timeout between events firing to make sure it's
  // not too rapid (for performance reasons).
  throttleTimeout: 50,
  // Element to add the positionFixedClass to.
  positionFixedSelector: null,
  // Fixed position class to add to make sidebar fixed after scrolling
  // down past the fixedSidebarOffset.
  positionFixedClass: 'is-position-fixed',
  // fixedSidebarOffset can be any number but by default is set
  // to auto which sets the fixedSidebarOffset to the sidebar
  // element's offsetTop from the top of the document on init.
  fixedSidebarOffset: 'auto',
  // includeHtml can be set to true to include the HTML markup from the
  // heading node instead of just including the textContent.
  includeHtml: false,
  // onclick function to apply to all links in toc. will be called with
  // the event as the first parameter, and this can be used to stop,
  // propagation, prevent default or perform action
  onClick: false,
  // orderedList can be set to false to generate unordered lists (ul)
  // instead of ordered lists (ol)
  orderedList: true,
  // If there is a fixed article scroll container, set to calculate titles' offset
  scrollContainer: null
}

},{}],3:[function(require,module,exports){
(function (global){
/**
 * Tocbot
 * Tocbot creates a toble of contents based on HTML headings on a page,
 * this allows users to easily jump to different sections of the document.
 * Tocbot was inspired by tocify (http://gregfranko.com/jquery.tocify.js/).
 * The main differences are that it works natively without any need for jquery or jquery UI).
 *
 * @author Tim Scanlin
 */

/* globals define */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory(root))
  } else if (typeof exports === 'object') {
    module.exports = factory(root)
  } else {
    root.tocbot = factory(root)
  }
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {
  'use strict'

  // Default options.
  var defaultOptions = require('./default-options.js')
  // Object to store current options.
  var options = {}
  // Object for public APIs.
  var tocbot = {}

  var BuildHtml = require('./build-html.js')
  var ParseContent = require('./parse-content.js')
  // Keep these variables at top scope once options are passed in.
  var buildHtml
  var parseContent

  // Just return if its not a browser.
  if (typeof window === 'undefined') {
    return
  }
  var supports = !!root.document.querySelector && !!root.addEventListener // Feature test
  var headingsArray

  // From: https://github.com/Raynos/xtend
  var hasOwnProperty = Object.prototype.hasOwnProperty
  function extend () {
    var target = {}
    for (var i = 0; i < arguments.length; i++) {
      var source = arguments[i]
      for (var key in source) {
        if (hasOwnProperty.call(source, key)) {
          target[key] = source[key]
        }
      }
    }
    return target
  }

  // From: https://remysharp.com/2010/07/21/throttling-function-calls
  function throttle (fn, threshhold, scope) {
    threshhold || (threshhold = 250)
    var last
    var deferTimer
    return function () {
      var context = scope || this
      var now = +new Date()
      var args = arguments
      if (last && now < last + threshhold) {
        // hold on to it
        clearTimeout(deferTimer)
        deferTimer = setTimeout(function () {
          last = now
          fn.apply(context, args)
        }, threshhold)
      } else {
        last = now
        fn.apply(context, args)
      }
    }
  }

  /**
   * Destroy tocbot.
   */
  tocbot.destroy = function () {
    // Clear HTML.
    try {
      document.querySelector(options.tocSelector).innerHTML = ''
    } catch (e) {
      console.warn('Element not found: ' + options.tocSelector); // eslint-disable-line
    }

    // Remove event listeners.
    if (options.scrollContainer && document.querySelector(options.scrollContainer)) {
      document.querySelector(options.scrollContainer).removeEventListener('scroll', this._scrollListener, false)
      document.querySelector(options.scrollContainer).removeEventListener('resize', this._scrollListener, false)
      if (buildHtml) {
        document.querySelector(options.scrollContainer).removeEventListener('click', this._clickListener, false)
      }
    } else {
      document.removeEventListener('scroll', this._scrollListener, false)
      document.removeEventListener('resize', this._scrollListener, false)
      if (buildHtml) {
        document.removeEventListener('click', this._clickListener, false)
      }
    }
  }

  /**
   * Initialize tocbot.
   * @param {object} customOptions
   */
  tocbot.init = function (customOptions) {
    // feature test
    if (!supports) {
      return
    }

    // Merge defaults with user options.
    // Set to options variable at the top.
    options = extend(defaultOptions, customOptions || {})
    this.options = options
    this.state = {}

    // Init smooth scroll if enabled (default).
    if (options.scrollSmooth) {
      options.duration = options.scrollSmoothDuration
      options.offset = options.scrollSmoothOffset
      tocbot.scrollSmooth = require('./scroll-smooth').initSmoothScrolling(options)
    }

    // Pass options to these modules.
    buildHtml = BuildHtml(options)
    parseContent = ParseContent(options)

    // For testing purposes.
    this._buildHtml = buildHtml
    this._parseContent = parseContent

    // Destroy it if it exists first.
    tocbot.destroy()

    // Get headings array.
    headingsArray = parseContent.selectHeadings(options.contentSelector, options.headingSelector)
    // Return if no headings are found.
    if (headingsArray === null) {
      return
    }

    // Build nested headings array.
    var nestedHeadingsObj = parseContent.nestHeadingsArray(headingsArray)
    var nestedHeadings = nestedHeadingsObj.nest

    // Render.
    buildHtml.render(options.tocSelector, nestedHeadings)

    // Update Sidebar and bind listeners.
    this._scrollListener = throttle(function (e) {
      buildHtml.updateToc(headingsArray)
      var isTop = e && e.target && e.target.scrollingElement && e.target.scrollingElement.scrollTop === 0
      if ((e && (e.eventPhase === 0 || e.currentTarget === null)) || isTop) {
        buildHtml.updateToc(headingsArray)
        if (options.scrollEndCallback) {
          options.scrollEndCallback(e)
        }
      }
    }, options.throttleTimeout)
    this._scrollListener()
    if (options.scrollContainer && document.querySelector(options.scrollContainer)) {
      document.querySelector(options.scrollContainer).addEventListener('scroll', this._scrollListener, false)
      document.querySelector(options.scrollContainer).addEventListener('resize', this._scrollListener, false)
    } else {
      document.addEventListener('scroll', this._scrollListener, false)
      document.addEventListener('resize', this._scrollListener, false)
    }

    // Bind click listeners to disable animation.
    var timeout = null
    this._clickListener = throttle(function (event) {
      if (options.scrollSmooth) {
        buildHtml.disableTocAnimation(event)
      }
      buildHtml.updateToc(headingsArray)
      // Timeout to re-enable the animation.
      timeout && clearTimeout(timeout)
      timeout = setTimeout(function () {
        buildHtml.enableTocAnimation()
      }, options.scrollSmoothDuration)
    }, options.throttleTimeout)
    
    if (options.scrollContainer && document.querySelector(options.scrollContainer)) {
      document.querySelector(options.scrollContainer).addEventListener('click', this._clickListener, false)
    } else {
      document.addEventListener('click', this._clickListener, false)
    }

    return this
  }

  /**
   * Refresh tocbot.
   */
  tocbot.refresh = function (customOptions) {
    tocbot.destroy()
    tocbot.init(customOptions || this.options)
  }

  // Make tocbot available globally.
  root.tocbot = tocbot

  return tocbot
})

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./build-html.js":1,"./default-options.js":2,"./parse-content.js":4,"./scroll-smooth":5}],4:[function(require,module,exports){
/**
 * This file is responsible for parsing the content from the DOM and making
 * sure data is nested properly.
 *
 * @author Tim Scanlin
 */

module.exports = function parseContent (options) {
  var reduce = [].reduce

  /**
   * Get the last item in an array and return a reference to it.
   * @param {Array} array
   * @return {Object}
   */
  function getLastItem (array) {
    return array[array.length - 1]
  }

  /**
   * Get heading level for a heading dom node.
   * @param {HTMLElement} heading
   * @return {Number}
   */
  function getHeadingLevel (heading) {
    return +heading.nodeName.split('H').join('')
  }

  /**
   * Get important properties from a heading element and store in a plain object.
   * @param {HTMLElement} heading
   * @return {Object}
   */
  function getHeadingObject (heading) {
    var obj = {
      id: heading.id,
      children: [],
      nodeName: heading.nodeName,
      headingLevel: getHeadingLevel(heading),
      textContent: heading.textContent.trim()
    }

    if (options.includeHtml) {
      obj.childNodes = heading.childNodes
    }

    return obj
  }

  /**
   * Add a node to the nested array.
   * @param {Object} node
   * @param {Array} nest
   * @return {Array}
   */
  function addNode (node, nest) {
    var obj = getHeadingObject(node)
    var level = getHeadingLevel(node)
    var array = nest
    var lastItem = getLastItem(array)
    var lastItemLevel = lastItem
      ? lastItem.headingLevel
      : 0
    var counter = level - lastItemLevel

    while (counter > 0) {
      lastItem = getLastItem(array)
      if (lastItem && lastItem.children !== undefined) {
        array = lastItem.children
      }
      counter--
    }

    if (level >= options.collapseDepth) {
      obj.isCollapsed = true
    }

    array.push(obj)
    return array
  }

  /**
   * Select headings in content area, exclude any selector in options.ignoreSelector
   * @param {String} contentSelector
   * @param {Array} headingSelector
   * @return {Array}
   */
  function selectHeadings (contentSelector, headingSelector) {
    var selectors = headingSelector
    if (options.ignoreSelector) {
      selectors = headingSelector.split(',')
        .map(function mapSelectors (selector) {
          return selector.trim() + ':not(' + options.ignoreSelector + ')'
        })
    }
    try {
      return document.querySelector(contentSelector)
        .querySelectorAll(selectors)
    } catch (e) {
      console.warn('Element not found: ' + contentSelector); // eslint-disable-line
      return null
    }
  }

  /**
   * Nest headings array into nested arrays with 'children' property.
   * @param {Array} headingsArray
   * @return {Object}
   */
  function nestHeadingsArray (headingsArray) {
    return reduce.call(headingsArray, function reducer (prev, curr) {
      var currentHeading = getHeadingObject(curr)

      addNode(currentHeading, prev.nest)
      return prev
    }, {
      nest: []
    })
  }

  return {
    nestHeadingsArray: nestHeadingsArray,
    selectHeadings: selectHeadings
  }
}

},{}],5:[function(require,module,exports){
/* globals location, requestAnimationFrame */

exports.initSmoothScrolling = initSmoothScrolling

function initSmoothScrolling (options) {
  if (isCssSmoothSCrollSupported()) { }

  var duration = options.duration
  var offset = options.offset

  var pageUrl = location.hash
    ? stripHash(location.href)
    : location.href

  delegatedLinkHijacking()

  function delegatedLinkHijacking () {
    document.body.addEventListener('click', onClick, false)

    function onClick (e) {
      if (
        !isInPageLink(e.target) ||
        e.target.className.indexOf('no-smooth-scroll') > -1 ||
        (e.target.href.charAt(e.target.href.length - 2) === '#' &&
        e.target.href.charAt(e.target.href.length - 1) === '!') ||
        e.target.className.indexOf(options.linkClass) === -1) {
        return
      }

      // Don't prevent default or hash doesn't change.
      // e.preventDefault()

      jump(e.target.hash, {
        duration: duration,
        offset: offset,
        callback: function () {
          setFocus(e.target.hash)
        }
      })
    }
  }

  function isInPageLink (n) {
    return n.tagName.toLowerCase() === 'a' &&
      (n.hash.length > 0 || n.href.charAt(n.href.length - 1) === '#') &&
      (stripHash(n.href) === pageUrl || stripHash(n.href) + '#' === pageUrl)
  }

  function stripHash (url) {
    return url.slice(0, url.lastIndexOf('#'))
  }

  function isCssSmoothSCrollSupported () {
    return 'scrollBehavior' in document.documentElement.style
  }

  // Adapted from:
  // https://www.nczonline.net/blog/2013/01/15/fixing-skip-to-content-links/
  function setFocus (hash) {
    var element = document.getElementById(hash.substring(1))

    if (element) {
      if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
        element.tabIndex = -1
      }

      element.focus()
    }
  }
}

function jump (target, options) {
  var start = window.pageYOffset
  var opt = {
    duration: options.duration,
    offset: options.offset || 0,
    callback: options.callback,
    easing: options.easing || easeInOutQuad
  }
  // This makes ids that start with a number work: ('[id="' + decodeURI(target).split('#').join('') + '"]')
  // DecodeURI for nonASCII hashes, they was encoded, but id was not encoded, it lead to not finding the tgt element by id.
  // And this is for IE: document.body.scrollTop
  var tgt = document.querySelector('[id="' + decodeURI(target).split('#').join('') + '"]')
  var distance = typeof target === 'string'
    ? opt.offset + (
      target
      ? (tgt && tgt.getBoundingClientRect().top) || 0 // handle non-existent links better.
      : -(document.documentElement.scrollTop || document.body.scrollTop))
    : target
  var duration = typeof opt.duration === 'function'
    ? opt.duration(distance)
    : opt.duration
  var timeStart
  var timeElapsed

  requestAnimationFrame(function (time) { timeStart = time; loop(time) })
  function loop (time) {
    timeElapsed = time - timeStart

    window.scrollTo(0, opt.easing(timeElapsed, start, distance, duration))

    if (timeElapsed < duration) { requestAnimationFrame(loop) } else { end() }
  }

  function end () {
    window.scrollTo(0, start + distance)

    if (typeof opt.callback === 'function') { opt.callback() }
  }

  // Robert Penner's easeInOutQuad - http://robertpenner.com/easing/
  function easeInOutQuad (t, b, c, d) {
    t /= d / 2
    if (t < 1) return c / 2 * t * t + b
    t--
    return -c / 2 * (t * (t - 2) - 1) + b
  }
}

},{}],6:[function(require,module,exports){
var tocbot = require('tocbot');
console.log("hej");
tocbot.init({
  // Where to render the table of contents.
  tocSelector: '.js-toc',
  // Where to grab the headings to build the table of contents.
  contentSelector: '.js-toc-content',
  // Which headings to grab inside of the contentSelector element.
  headingSelector: 'h1, h2, h3',
});

},{"tocbot":3}]},{},[6]);
