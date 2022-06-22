if (typeof(jQuery) === 'undefined') {
  var
    jQuery
  ;
  // Check if require is a defined function.
  if (typeof(require) === 'function') {
    jQuery = $ = require('jquery');
    // Else use the dollar sign alias.
  } else {
    jQuery = $;
  }
};

// :focusable expression
$.extend($.expr[':'], {
  focusable: function(element, hasTabindex) {
    var
      map, mapName, img, focusableIfVisible, fieldset,
      nodeName = element.nodeName.toLowerCase()
    ;

    if ("area" === nodeName) {
      map = element.parentNode;
      mapName = map.name;

      if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
        return false;
      }

      img = $("img[usemap='#" + mapName + "']");

      return (img.length > 0 && img.is(":visible"));
    }

    if (/^(input|select|textarea|button|object)$/.test(nodeName)) {
      focusableIfVisible = !element.disabled;

      if (focusableIfVisible) {
        fieldset = $(element).closest("fieldset")[0];

        if (fieldset) {
          focusableIfVisible = !fieldset.disabled;
        }
      }
    }
    else if ("a" === nodeName) {
      focusableIfVisible = element.href || hasTabindex;
    }
    else {
      focusableIfVisible = hasTabindex;
    }

    return (focusableIfVisible && $(element).is(":visible") && visible($(element)));

    function visible( element ) {
      var
        visibility = element.css( "visibility" )
      ;

      while ( visibility === "inherit" ) {
        element = element.parent();
        visibility = element.css( "visibility" );
      }

      return visibility !== "hidden";
    }

    var form = $.fn.form = function() {
      return (typeof this[0].form === "string")
        ? this.closest("form")
        : $(this[0].form)
      ;
    };
  }
});

// on Ctrl+A click fire `onSelectAll` event
$(window).on("keydown", function(e) {
  if (!(e.ctrlKey && (e.which || e.keyCode) == 65)) {
    return;
  }

  if ($("input:focus, textarea:focus").length > 0) {
    return;
  }

  var
    selectAllEvent = new $.Event("onSelectAll")
  ;

  selectAllEvent.parentEvent = e;
  $(window).trigger(selectAllEvent);

  return true;
});

// Is iOS?
var
  IS_IOS = /iPad|iPhone|iPod/.test(navigator.platform),
  IS_TOUCH = (
    ('ontouchstart' in document) ||
    (window.DocumentTouch && document instanceof window.DocumentTouch)  ||
    (window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 0) || //IE 10
    (window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 0) || //IE >=11
    false
  )
;

// scrollbar Width
function scrollbarWidth() {
  var
    w1, w2,
    div = $( "<div " +
      "style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'>" +
      "<div style='height:100px;width:auto;'></div></div>" ),
    innerDiv = div.children()[0]
  ;

  $("body").append(div);
  w1 = innerDiv.offsetWidth;
  div.css("overflow", "scroll");
  w2 = innerDiv.offsetWidth;

  if (w1 === w2) {
    w2 = div[0].clientWidth;
  }

  div.remove();

  return (w1 - w2);
}

// Lock the screen
function lockScreen(lockClass) {
  if (IS_IOS) {
    return;
  }

  var
    $html = $("html"),
    scrollPos = $html.scrollTop(),
    scroll = false
  ;

  if (!$html.hasClass(lockClass)) {
    if ($("body").outerHeight(true) > $(window).height()) {
      scroll = true;
      $html.css("margin-right", parseInt($html.css("margin-right")) + scrollbarWidth() + "px");
    }

    $html.addClass(lockClass);

    return {preLocked: false, lockClass: lockClass, scroll: scroll, scrollPos: scrollPos}
  }
  else {
    return {preLocked: true}
  }
}

// Unlocks the screen
function unlockScreen(unlockInfo) {
  if (IS_IOS) {
    return;
  }

  var
    $html = $("html")
  ;

  if (unlockInfo.preLocked) {
    return;
  }

  if ($html.hasClass(unlockInfo.lockClass)) {
    if (unlockInfo.scroll) {
      $html.css("margin-right", parseInt($html.css("margin-right")) - scrollbarWidth() + "px");
    }

    $html.removeClass(unlockInfo.lockClass);
    $html.scrollTop(unlockInfo.scrollPos || 0);
  }
}

// Unique ID
var
  uuid = 0,
  uniqueId = function(nameSpace) {
    uuid++;

    nameSpace = (nameSpace != undefined && typeof(nameSpace) === "string")
      ? nameSpace
      : "unique-id"

    return nameSpace + uuid;
  }
;

/*!
* Emmandave UI sidebar
* Copyright 2016-2017 Folorunso David A.
*/

(function($) {

  $.fn.sidebar = function(options) {
    this.each(function() {
        var
          defaults = {
          pluginName: "sidebar", lockClass: "sidebar-lock", dismissible: true,
          scrollLock: false, returnScroll: false, inDuration: 500, outDuration: 500
          },
        options = $.extend(defaults, options), $this = $(this),
        sidebarId = $this.attr("href") || "#"+$(this).data("target"),
        sidebar = $(sidebarId)
        ;

      function openSidebar($this) {
        if ($this.hasClass("active")) { return }

        if (options.returnScroll) { $this.data("scrollPos", $("body").scrollTop()) }

        if (options.scrollLock) { options.unlockInfo = lockScreen(options.lockClass) }

        $this.addClass("active");

        if (options.dismissible) {
          $(document).on("click."+options.uniqueId, function(e) {
                if (!$(e.target).closest($this).length) { closeSidebar($this) }
          })
        }

            $this.addClass("animating");
        setTimeout(function() { $this.removeClass("animating") }, options.inDuration);
      }

      function closeSidebar($this) {
        if (!$this.hasClass("active")) { return }

        $this.removeClass("active");

        $(document).off("click."+options.uniqueId);
        $this.addClass("animating");
        setTimeout(function() {
          $this.removeClass("animating");

          if (options.scrollLock) { unlockScreen(options.unlockInfo) }

          if (options.returnScroll) { $("body").scrollTop($this.data("scrollPos")) }
        }, options.outDuration)
      }

      options.uniqueId = uniqueId(options.pluginName);

      sidebar.find(".close").click(function() { closeSidebar(sidebar) });

      $this.click(function(e) {
        e.stopPropagation();
        e.preventDefault();

        if (!sidebar.hasClass("active")) { openSidebar(sidebar) }
            else if (sidebar.hasClass("active")) { closeSidebar(sidebar) }
      })
    })
  }

  $(document).ready(function() { $(".sidebar-trigger").sidebar() })

}(jQuery));

/*!
* Emmandave UI tabs
* Copyright 2016-2017 Folorunso David A.
*/

(function ($) {

  $.fn.tabs = function() {
    this.each(function() {
      var
        $this = $(this), $items = $this.find(".item[href], .item[data-target]"),
        $index, $active, $content
      ;

      $active = $($items.filter("[href='" + location.hash + "']")).length
        ? $($items.filter("[href='" + location.hash + "']")).first()
        : $($items.filter("[data-target='" + location.hash.substring(1) + "']")).length
          ? $($items.filter("[data-target='" + location.hash.substring(1) +
            "']")).first()
          : $($items.filter("[data-target='" + location.hash.substring(2) +
            "']")).length &&
            location.hash.substring(0,2) == "#/"
            ? $($items.filter("[data-target='" + location.hash.substring(2) +
              "']")).first()
            : $items.filter(".active").first().length
              ? $items.filter(".active").first()
              : $items.first();


      if ($active.length) { tabChecker($items, $active) }

      $this.click(function(e) {
        var target = $(e.target), $this;

        if (target.closest(".item[href], .item[data-target]").length) {
          $this = target.closest(".item[href], .item[data-target]")
        }
        else { return }

        if ($this.hasClass("disabled")) { return }

        e.preventDefault();
        tabChecker($items, $this, true)
      });

      function tabChecker($items, $active, cTrigger) {
        $items.not($active).removeClass("active").each(function() {
          $($(this)[0].hash || "#" + $(this).data("target")).removeClass("active");
        });

        $active.addClass("active");

        var activeHash = $active[0].hash || "#" + $active.data("target");

        $(activeHash).addClass("active");

        if (cTrigger) { location.hash = "#/"+activeHash.slice(1) }
      }
    })
  }

  $(document).ready(function() { $(".tabs").tabs() })

}(jQuery));

/*!
* Emmadave UI Modal
* Copyright 2016-2017 Folorunso David A.
*/

(function($) {

  $.fn.extend({
    openModal: function(options) {
      var
        defaults = {
          pluginName: "modal", lockClass: "modal-lock", overlayClass: "modal-overlay",
          closeOnEsc: true, closeOnOverlayClick: true, closeOnCancel: true,
          inDuration: 500, ready: undefined, autoOpen: false
        },
        modal = $(this), options = $.extend(defaults, options)
      ;

      if (modal.hasClass("active")) { return }

      modal.addClass("active");
      modal.data("uniqueid", uniqueId(options.pluginName));

      var uniqueid = modal.data("uniqueid");

      modal.wrap("<div class='" + options.overlayClass + "'>");
      modal.data("unlockInfo", lockScreen(options.lockClass));
      overlay = modal.parent("." + options.overlayClass).attr("tabindex", -1).scrollTop(0);

      if (modal.hasClass("back-blur")) { options.blurring = true }

      if (options.closeOnOverlayClick && !modal.hasClass("full-screen")) {
        overlay.click(function(e) {
          var $target = $(e.target);

          if (!$target.closest(modal).length) { modal.closeModal(options) }
        })
      }

      if (options.closeOnEsc) {
        overlay.keyup(function(e) { if (e.keyCode === 27) { modal.closeModal(options) } })
      }

      modal.find(".close").click(function() { modal.closeModal(options) });

      if (options.blurring) {
        if ($("body").hasClass("modal-blur")) { modal.data("preBlured", true) }
        else { $("body").addClass("modal-blur") }
      }

      $(window).on("onSelectAll." + uniqueid, function(e) {
        e.parentEvent.preventDefault();

        var selectionElement = modal[0], range, selection;

        if (document.body.createTextRange) {
          range = document.body.createTextRange();
          range.moveToElementText(selectionElement);
          range.select()
        }
        else if (window.getSelection) {
          selection = window.getSelection();
          range = document.createRange();
          range.selectNodeContents(selectionElement);
          selection.removeAllRanges();
          selection.addRange(range)
        }
      });

      overlay.keydown(function(e) {
        var modalFocusableElements = $(":focusable", $(this));

        if (modalFocusableElements.filter(":last").is(":focus") && (!e.shiftKey && e.keyCode === 9)) {
          e.preventDefault();
          modalFocusableElements.filter(":first").focus()
        }
        else if (modalFocusableElements.filter(":first").is(":focus") && (e.shiftKey && e.keyCode === 9)) {
          e.preventDefault();
          modalFocusableElements.filter(":last").focus()
        }
      });

      if (modal.hasClass("self-scroll")) {
        overlay.css("display", "flex");
        modal.css("margin", "0")
      }
      else { overlay.show() }

      overlay.css({opacity: 0.7}).animate({opacity: 1}, {
        duration: options.inDuration, queue: false
      });
      modal.addClass("animating").show();
      setTimeout(function() {
        modal.removeClass("animating");
        if (typeof(options.ready)==="function") { options.ready() }
        overlay.focus();
        modal.data("modal-options", options)
      }, options.inDuration)
    },

    closeModal: function(options) {
      var
        defaults = { outDuration: 500, complete: undefined },
        modal = $(this), uniqueid = modal.data("uniqueid")
      ;

      if (!modal.hasClass("active")) { return }

      modal.removeClass("active");
      options = $.extend(defaults, options);
      overlay.css("overflow", "hidden");
      $(window).off("onSelectAll." + uniqueid);

      if (modal.hasClass("back-blur")) { options.blurring = true }

      if (options.blurring && !options.preBlured) { $("body").removeClass("modal-blur") }

      overlay.animate({opacity: 0}, { duration: options.out_duration, queue: false });
      modal.addClass("animating");
      setTimeout(function() {
        unlockScreen(modal.data("unlockInfo"));
        modal.removeClass("animating").css("margin", "").hide().unwrap();

        if (typeof(options.complete) === "function") { options.complete() }
        if (options.lastFocus != undefined) { options.lastFocus.focus() }
      }, options.outDuration)
    },

    modal: function(options) {
      this.each(function() {
        var
          $this = $(this),
          modalID = $(this).attr("href") || "#" + $(this).data("target"), modal = $(modalID)
        ;

        options = {};

        $this.click(function() {
          options.lastFocus = $this;
          modal.openModal(options)
        })
      })
    }
  });

  $(document).ready(function() { $(".modal-trigger").modal() })

})(jQuery);


/*!
* emmandave UI scrollPin
* Copyright 2016-2017 David A.
*/

(function($) {
  $.fn.scrollPin = function(options) {
    options = options || {};
    this.each(function(index) {
      var defaults = {
          className: "pinned",
          contain: false,
          topSpacing: 0,
          bottomSpacing: 0,
          onPin: undefined,
          onUnpin: undefined
        },
        options = $.extend(defaults, options),
        $this = $(this),
        prop = {},
        parent = $this.parent(), parent_height, parent_offset,
        uniqueid = (Math.random() + 1).toString(36).substring(2, 7);

      options.uniqueid = ".pin_" + uniqueid + "_" + index;
      recalc = function() {

        prop.offset = $this.offset();
        prop.position = $this.position();
        prop.height = $this.outerHeight(true);
        prop.marginL = (parseInt($this.css("marginLeft"), 10) || 0);
        prop.marginT = (parseInt($this.css("marginTop"), 10) || 0);

        // adjust offset with margins
        prop.offset.left -= prop.marginL;
        prop.offset.top -= prop.marginT;

        // if pinned element needs to be contained inside the parent element"s boundaries
        parent_height = parent.height() + parseInt(parent.css("padding-top"), 10) + parseInt(parent.css("border-top-width"), 10),
        parent_offset = parent.offset();
      };

      // update function
      function update($this, prop, options) {
        recalc();

        // off a previously set callback function (if any) and re-on the scroll.options.uniqueid event
        $(window).off("scroll."+options.uniqueid).on("scroll."+options.uniqueid, function() {
          var scroll = $(window).scrollTop();

          if (scroll >= (prop.offset.top - options.topSpacing) &&
          (!options.contain || (scroll <= parent_offset.top + parent_height - prop.height - options.bottomSpacing)) &&
          $this.css("position") != "fixed") {
            $this.css({
              "top": options.topSpacing,
              "left": prop.offset.left
            }).addClass(options.className);

            if (typeof options.onPin == "function") {
              options.onPin();
            }
          } else if (options.contain &&
          scroll >= (parent_offset.top + parent_height - prop.height - options.bottomSpacing) &&
          $this.css("position") != "absolute") {
            $this.css({
              "position": "absolute",
              "top": parent_offset.top + parent_height - prop.height - options.bottomSpacing,
              "left": prop.position.left
            }).removeClass(options.className);

            if (typeof options.onUnpin == "function") {
              options.onUnpin();
            }
          } else if (scroll < (prop.offset.top - options.topSpacing) &&
          $this.css("position") === "fixed") {
            $this.css({
              "top": "",
              "left": "",
              "position": ""
            }).removeClass(options.className);

            if (typeof options.onUnpin == "function") {
              options.onUnpin();
            }
          }
        });

        // trigger the scroll event so that computations take effect
        $(window).trigger("scroll." + options.uniqueid);
      }

      // update elements" position
      update($this, prop, options);
      // on window resize update elements" position
      $(window).off("resize.scrollPin").on("resize.scrollPin", function() {
        update($this, prop, options);
      });
    });
  };

  // Initialize scrollPin
  $(document).ready(function() {
    $(".stick").scrollPin();
  });
}(jQuery));

/*!
* Waves v0.7.5
* http://fian.my.id/Waves
*
* Copyright 2014-2016 Alfiana E. Sibuea and other contributors
* Released under the MIT license
* https://github.com/fians/Waves/blob/master/LICENSE
*/

;(function(window, factory) {
  'use strict';

  // AMD. Register as an anonymous module.  Wrap in function so we have access
  // to root via `this`.
  if (typeof define === 'function' && define.amd) {
    define([], function() {
      return factory.apply(window);
    });
  }

  // Node. Does not work with strict CommonJS, but only CommonJS-like
  // environments that support module.exports, like Node.
  else if (typeof exports === 'object') {
    module.exports = factory.call(window);
  }

  // Browser globals.
  else {
    window.Waves = factory.call(window);
  }
})(typeof global === 'object' ? global : this, function() {
  'use strict';

  var Waves            = Waves || {};
  var $$               = document.querySelectorAll.bind(document);
  var toString         = Object.prototype.toString;
  var isTouchAvailable = 'ontouchstart' in window;


  // Find exact position of element
  function isWindow(obj) {
    return obj !== null && obj === obj.window;
  }

  function getWindow(elem) {
    return isWindow(elem) ? elem : elem.nodeType === 9 && elem.defaultView;
  }

  function isObject(value) {
    var type = typeof value;
    return type === 'function' || type === 'object' && !!value;
  }

  function isDOMNode(obj) {
    return isObject(obj) && obj.nodeType > 0;
  }

  function getWavesElements(nodes) {
    var stringRepr = toString.call(nodes);

    if (stringRepr === '[object String]') {
      return $$(nodes);
    } else if (isObject(nodes) && /^\[object (Array|HTMLCollection|NodeList|Object)\]$/.test(stringRepr) && nodes.hasOwnProperty('length')) {
      return nodes;
    } else if (isDOMNode(nodes)) {
      return [nodes];
    }

    return [];
  }

  function offset(elem) {
    var docElem, win,
    box = { top: 0, left: 0 },
    doc = elem && elem.ownerDocument;

    docElem = doc.documentElement;

    if (typeof elem.getBoundingClientRect !== typeof undefined) {
      box = elem.getBoundingClientRect();
    }
    win = getWindow(doc);
    return {
      top: box.top + win.pageYOffset - docElem.clientTop,
      left: box.left + win.pageXOffset - docElem.clientLeft
    };
  }

  function convertStyle(styleObj) {
    var style = '';

    for (var prop in styleObj) {
      if (styleObj.hasOwnProperty(prop)) {
        style += (prop + ':' + styleObj[prop] + ';');
      }
    }

    return style;
  }

  var Effect = {

    // Effect duration
    duration: 750,

    // Effect delay (check for scroll before showing effect)
    delay: 200,

    show: function(e, element, velocity) {

      // Disable right click
      if (e.button === 2) {
        return false;
      }

      element = element || this;

      // Create ripple
      var ripple = document.createElement('div');
      ripple.className = 'waves-ripple waves-rippling';
      element.appendChild(ripple);

      // Get click coordinate and element width
      var pos       = offset(element);
      var relativeY = 0;
      var relativeX = 0;
      // Support for touch devices
      if('touches' in e && e.touches.length) {
        relativeY   = (e.touches[0].pageY - pos.top);
        relativeX   = (e.touches[0].pageX - pos.left);
      }
      //Normal case
      else {
        relativeY   = (e.pageY - pos.top);
        relativeX   = (e.pageX - pos.left);
      }
      // Support for synthetic events
      relativeX = relativeX >= 0 ? relativeX : 0;
      relativeY = relativeY >= 0 ? relativeY : 0;

      var scale     = 'scale(' + ((element.clientWidth / 100) * 3) + ')';
      var translate = 'translate(0,0)';

      if (velocity) {
        translate = 'translate(' + (velocity.x) + 'px, ' + (velocity.y) + 'px)';
      }

      // Attach data to element
      ripple.setAttribute('data-hold', Date.now());
      ripple.setAttribute('data-x', relativeX);
      ripple.setAttribute('data-y', relativeY);
      ripple.setAttribute('data-scale', scale);
      ripple.setAttribute('data-translate', translate);

      // Set ripple position
      var rippleStyle = {
        top: relativeY + 'px',
        left: relativeX + 'px'
      };

      ripple.classList.add('waves-notransition');
      ripple.setAttribute('style', convertStyle(rippleStyle));
      ripple.classList.remove('waves-notransition');

      // Scale the ripple
      rippleStyle['-webkit-transform'] = scale + ' ' + translate;
      rippleStyle['-moz-transform'] = scale + ' ' + translate;
      rippleStyle['-ms-transform'] = scale + ' ' + translate;
      rippleStyle['-o-transform'] = scale + ' ' + translate;
      rippleStyle.transform = scale + ' ' + translate;
      rippleStyle.opacity = '1';

      var duration = e.type === 'mousemove' ? 2500 : Effect.duration;
      rippleStyle['-webkit-transition-duration'] = duration + 'ms';
      rippleStyle['-moz-transition-duration']    = duration + 'ms';
      rippleStyle['-o-transition-duration']      = duration + 'ms';
      rippleStyle['transition-duration']         = duration + 'ms';

      ripple.setAttribute('style', convertStyle(rippleStyle));
    },

    hide: function(e, element) {
      element = element || this;

      var ripples = element.getElementsByClassName('waves-rippling');

      for (var i = 0, len = ripples.length; i < len; i++) {
        removeRipple(e, element, ripples[i]);
      }
    }
  };

  /**
  * Collection of wrapper for HTML element that only have single tag
  * like <input> and <img>
  */
  var TagWrapper = {

    // Wrap <input> tag so it can perform the effect
    input: function(element) {

      var parent = element.parentNode;

      // If input already have parent just pass through
      if (parent.tagName.toLowerCase() === 'i' && parent.classList.contains('waves-effect')) {
        return;
      }

      // Put element class and style to the specified parent
      var wrapper       = document.createElement('i');
      wrapper.className = element.className + ' waves-input-wrapper';
      element.className = 'waves-button-input';

      // Put element as child
      parent.replaceChild(wrapper, element);
      wrapper.appendChild(element);

      // Apply element color and background color to wrapper
      var elementStyle    = window.getComputedStyle(element, null);
      var color           = elementStyle.color;
      var backgroundColor = elementStyle.backgroundColor;

      wrapper.setAttribute('style', 'color:' + color + ';background:' + backgroundColor);
      element.setAttribute('style', 'background-color:rgba(0,0,0,0);');

    },

    // Wrap <img> tag so it can perform the effect
    img: function(element) {

      var parent = element.parentNode;

      // If input already have parent just pass through
      if (parent.tagName.toLowerCase() === 'i' && parent.classList.contains('waves-effect')) {
        return;
      }

      // Put element as child
      var wrapper  = document.createElement('i');
      parent.replaceChild(wrapper, element);
      wrapper.appendChild(element);

    }
  };

  /**
  * Hide the effect and remove the ripple. Must be
  * a separate function to pass the JSLint...
  */
  function removeRipple(e, el, ripple) {

    // Check if the ripple still exist
    if (!ripple) {
      return;
    }

    ripple.classList.remove('waves-rippling');

    var relativeX = ripple.getAttribute('data-x');
    var relativeY = ripple.getAttribute('data-y');
    var scale     = ripple.getAttribute('data-scale');
    var translate = ripple.getAttribute('data-translate');

    // Get delay beetween mousedown and mouse leave
    var diff = Date.now() - Number(ripple.getAttribute('data-hold'));
    var delay = 350 - diff;

    if (delay < 0) {
      delay = 0;
    }

    if (e.type === 'mousemove') {
      delay = 150;
    }

    // Fade out ripple after delay
    var duration = e.type === 'mousemove' ? 2500 : Effect.duration;

    setTimeout(function() {

      var style = {
        top: relativeY + 'px',
        left: relativeX + 'px',
        opacity: '0',

        // Duration
        '-webkit-transition-duration': duration + 'ms',
        '-moz-transition-duration': duration + 'ms',
        '-o-transition-duration': duration + 'ms',
        'transition-duration': duration + 'ms',
        '-webkit-transform': scale + ' ' + translate,
        '-moz-transform': scale + ' ' + translate,
        '-ms-transform': scale + ' ' + translate,
        '-o-transform': scale + ' ' + translate,
        'transform': scale + ' ' + translate
      };

      ripple.setAttribute('style', convertStyle(style));

      setTimeout(function() {
        try {
          el.removeChild(ripple);
        } catch (e) {
          return false;
        }
      }, duration);

    }, delay);
  }


  /**
  * Disable mousedown event for 500ms during and after touch
  */
  var TouchHandler = {

    /* uses an integer rather than bool so there's no issues with
    * needing to clear timeouts if another touch event occurred
    * within the 500ms. Cannot mouseup between touchstart and
    * touchend, nor in the 500ms after touchend. */
    touches: 0,

    allowEvent: function(e) {

      var allow = true;

      if (/^(mousedown|mousemove)$/.test(e.type) && TouchHandler.touches) {
        allow = false;
      }

      return allow;
    },
    registerEvent: function(e) {
      var eType = e.type;

      if (eType === 'touchstart') {

        TouchHandler.touches += 1; // push

      } else if (/^(touchend|touchcancel)$/.test(eType)) {

        setTimeout(function() {
          if (TouchHandler.touches) {
            TouchHandler.touches -= 1; // pop after 500ms
          }
        }, 500);

      }
    }
  };


  /**
  * Delegated click handler for .waves-effect element.
  * returns null when .waves-effect element not in "click tree"
  */
  function getWavesEffectElement(e) {

    if (TouchHandler.allowEvent(e) === false) {
      return null;
    }

    var element = null;
    var target = e.target || e.srcElement;

    while (target.parentElement !== null) {
      if (target.classList.contains('waves-effect') && (!(target instanceof SVGElement))) {
        element = target;
        break;
      }
      target = target.parentElement;
    }

    return element;
  }

  /**
  * Bubble the click and show effect if .waves-effect elem was found
  */
  function showEffect(e) {

    // Disable effect if element has "disabled" property on it
    // In some cases, the event is not triggered by the current element
    // if (e.target.getAttribute('disabled') !== null) {
    //     return;
    // }

    var element = getWavesEffectElement(e);

    if (element !== null) {

      // Make it sure the element has either disabled property, disabled attribute or 'disabled' class
      if (element.disabled || element.getAttribute('disabled') || element.classList.contains('disabled')) {
        return;
      }

      TouchHandler.registerEvent(e);

      if (e.type === 'touchstart' && Effect.delay) {

        var hidden = false;

        var timer = setTimeout(function () {
          timer = null;
          Effect.show(e, element);
        }, Effect.delay);

        var hideEffect = function(hideEvent) {

          // if touch hasn't moved, and effect not yet started: start effect now
          if (timer) {
            clearTimeout(timer);
            timer = null;
            Effect.show(e, element);
          }
          if (!hidden) {
            hidden = true;
            Effect.hide(hideEvent, element);
          }
        };

        var touchMove = function(moveEvent) {
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }
          hideEffect(moveEvent);
        };

        element.addEventListener('touchmove', touchMove, false);
        element.addEventListener('touchend', hideEffect, false);
        element.addEventListener('touchcancel', hideEffect, false);

      } else {

        Effect.show(e, element);

        if (isTouchAvailable) {
          element.addEventListener('touchend', Effect.hide, false);
          element.addEventListener('touchcancel', Effect.hide, false);
        }

        element.addEventListener('mouseup', Effect.hide, false);
        element.addEventListener('mouseleave', Effect.hide, false);
      }
    }
  }

  Waves.init = function(options) {
    var body = document.body;

    options = options || {};

    if ('duration' in options) {
      Effect.duration = options.duration;
    }

    if ('delay' in options) {
      Effect.delay = options.delay;
    }

    if (isTouchAvailable) {
      body.addEventListener('touchstart', showEffect, false);
      body.addEventListener('touchcancel', TouchHandler.registerEvent, false);
      body.addEventListener('touchend', TouchHandler.registerEvent, false);
    }

    body.addEventListener('mousedown', showEffect, false);
  };


  /**
  * Attach Waves to dynamically loaded inputs, or add .waves-effect and other
  * waves classes to a set of elements. Set drag to true if the ripple mouseover
  * or skimming effect should be applied to the elements.
  */
  Waves.attach = function(elements, classes) {

    elements = getWavesElements(elements);

    if (toString.call(classes) === '[object Array]') {
      classes = classes.join(' ');
    }

    classes = classes ? ' ' + classes : '';

    var element, tagName;

    for (var i = 0, len = elements.length; i < len; i++) {

      element = elements[i];
      tagName = element.tagName.toLowerCase();

      if (['input', 'img'].indexOf(tagName) !== -1) {
        TagWrapper[tagName](element);
        element = element.parentElement;
      }

      if (element.className.indexOf('waves-effect') === -1) {
        element.className += ' waves-effect' + classes;
      }
    }
  };


  /**
  * Cause a ripple to appear in an element via code.
  */
  Waves.ripple = function(elements, options) {
    elements = getWavesElements(elements);
    var elementsLen = elements.length;

    options          = options || {};
    options.wait     = options.wait || 0;
    options.position = options.position || null; // default = centre of element


    if (elementsLen) {
      var element, pos, off, centre = {}, i = 0;
      var mousedown = {
        type: 'mousedown',
        button: 1
      };
      var hideRipple = function(mouseup, element) {
        return function() {
          Effect.hide(mouseup, element);
        };
      };

      for (; i < elementsLen; i++) {
        element = elements[i];
        pos = options.position || {
          x: element.clientWidth / 2,
          y: element.clientHeight / 2
        };

        off      = offset(element);
        centre.x = off.left + pos.x;
        centre.y = off.top + pos.y;

        mousedown.pageX = centre.x;
        mousedown.pageY = centre.y;

        Effect.show(mousedown, element);

        if (options.wait >= 0 && options.wait !== null) {
          var mouseup = {
            type: 'mouseup',
            button: 1
          };

          setTimeout(hideRipple(mouseup, element), options.wait);
        }
      }
    }
  };

  /**
  * Remove all ripples from an element.
  */
  Waves.calm = function(elements) {
    elements = getWavesElements(elements);
    var mouseup = {
      type: 'mouseup',
      button: 1
    };

    for (var i = 0, len = elements.length; i < len; i++) {
      Effect.hide(mouseup, elements[i]);
    }
  };

  /**
  * Deprecated API fallback
  */
  Waves.displayEffect = function(options) {
    console.error('Waves.displayEffect() has been deprecated and will be removed in future version. Please use Waves.init() to initialize Waves effect');
    Waves.init(options);
  };

  return Waves;
});

window.Waves = Waves;
document.addEventListener('DOMContentLoaded', function() {
  Waves.init();
}, false);
