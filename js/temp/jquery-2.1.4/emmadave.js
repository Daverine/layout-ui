
if (typeof(jQuery) === 'undefined') {
  var jQuery;
  // Check if require is a defined function.
  if (typeof(require) === 'function') {
    jQuery = $ = require('jquery');
    // Else use the dollar sign alias.
  } else {
    jQuery = $;
  }
};
/*
* jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
*
* Uses the built in easing capabilities added In jQuery 1.1
* to offer multiple easing options
*
* TERMS OF USE - jQuery Easing
*
* Open source under the BSD License.
*
* Copyright © 2008 George McGinley Smith
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without modification,
* are permitted provided that the following conditions are met:
*
* Redistributions of source code must retain the above copyright notice, this list of
* conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list
* of conditions and the following disclaimer in the documentation and/or other materials
* provided with the distribution.
*
* Neither the name of the author nor the names of contributors may be used to endorse
* or promote products derived from this software without specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
* MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
*  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
*  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
*  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
* AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
*  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
* OF THE POSSIBILITY OF SUCH DAMAGE.
*
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing, {
  def: 'easeOutQuad',
  swing: function (x, t, b, c, d) {
    //alert(jQuery.easing.default);
    return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
  },
  easeInQuad: function (x, t, b, c, d) {
    return c*(t/=d)*t + b;
  },
  easeOutQuad: function (x, t, b, c, d) {
    return -c *(t/=d)*(t-2) + b;
  },
  easeInOutQuad: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t + b;
    return -c/2 * ((--t)*(t-2) - 1) + b;
  },
  easeInCubic: function (x, t, b, c, d) {
    return c*(t/=d)*t*t + b;
  },
  easeOutCubic: function (x, t, b, c, d) {
    return c*((t=t/d-1)*t*t + 1) + b;
  },
  easeInOutCubic: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t + b;
    return c/2*((t-=2)*t*t + 2) + b;
  },
  easeInQuart: function (x, t, b, c, d) {
    return c*(t/=d)*t*t*t + b;
  },
  easeOutQuart: function (x, t, b, c, d) {
    return -c * ((t=t/d-1)*t*t*t - 1) + b;
  },
  easeInOutQuart: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
    return -c/2 * ((t-=2)*t*t*t - 2) + b;
  },
  easeInQuint: function (x, t, b, c, d) {
    return c*(t/=d)*t*t*t*t + b;
  },
  easeOutQuint: function (x, t, b, c, d) {
    return c*((t=t/d-1)*t*t*t*t + 1) + b;
  },
  easeInOutQuint: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
    return c/2*((t-=2)*t*t*t*t + 2) + b;
  },
  easeInSine: function (x, t, b, c, d) {
    return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
  },
  easeOutSine: function (x, t, b, c, d) {
    return c * Math.sin(t/d * (Math.PI/2)) + b;
  },
  easeInOutSine: function (x, t, b, c, d) {
    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
  },
  easeInExpo: function (x, t, b, c, d) {
    return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
  },
  easeOutExpo: function (x, t, b, c, d) {
    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
  },
  easeInOutExpo: function (x, t, b, c, d) {
    if (t==0) return b;
    if (t==d) return b+c;
    if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
    return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
  },
  easeInCirc: function (x, t, b, c, d) {
    return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
  },
  easeOutCirc: function (x, t, b, c, d) {
    return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
  },
  easeInOutCirc: function (x, t, b, c, d) {
    if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
    return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
  },
  easeInElastic: function (x, t, b, c, d) {
    var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
  },
  easeOutElastic: function (x, t, b, c, d) {
    var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
  },
  easeInOutElastic: function (x, t, b, c, d) {
    var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
  },
  easeInBack: function (x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c*(t/=d)*t*((s+1)*t - s) + b;
  },
  easeOutBack: function (x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
  },
  easeInOutBack: function (x, t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
  },
  easeInBounce: function (x, t, b, c, d) {
    return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
  },
  easeOutBounce: function (x, t, b, c, d) {
    if ((t/=d) < (1/2.75)) {
      return c*(7.5625*t*t) + b;
    } else if (t < (2/2.75)) {
      return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
    } else if (t < (2.5/2.75)) {
      return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
    } else {
      return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
    }
  },
  easeInOutBounce: function (x, t, b, c, d) {
    if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
    return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
  }
});

/*
*
* TERMS OF USE - EASING EQUATIONS
*
* Open source under the BSD License.
*
* Copyright © 2001 Robert Penner
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without modification,
* are permitted provided that the following conditions are met:
*
* Redistributions of source code must retain the above copyright notice, this list of
* conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright notice, this list
* of conditions and the following disclaimer in the documentation and/or other materials
* provided with the distribution.
*
* Neither the name of the author nor the names of contributors may be used to endorse
* or promote products derived from this software without specific prior written permission.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
* MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
*  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
*  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
*  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
* AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
*  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
* OF THE POSSIBILITY OF SUCH DAMAGE.
*
*/

/*!
* emmandave UI Collapsible
* Copyright 2016-2017 David A.
*/

(function ($) {
  $.fn.collapsible = function(options) {
    options = options || {};
    this.each(function() {
      var element = $(this),
        $titles = element.find('> li > .title');

      element.off('click', '> li > .title');
      $titles.off('click');

      // Accordion Collapsible
      function accordionCollapsible(object) {
        var $body = object.siblings('.content');

        if (object.hasClass('active')) {
          object.parent().addClass('working');
        }
        else {
          object.parent().removeClass('working');
        }
        if (object.parent().hasClass('working')) {
          $body.stop(true,false).slideDown({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
        }
        else {
          $body.stop(true,false).slideUp({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
        }
        $titles.not(object).removeClass('active').parent().removeClass('working');
        $titles.not(object).parent().children('.content').stop(true,false).slideUp({
          duration: 350,
          easing: "easeOutQuart",
          queue: false,
          complete: function() {$(this).css('height', '');}
        });
      };
      // Expandable Collapsible
      function expandableCollapsible(object) {
        var $body = object.siblings('.content');

        if (object.hasClass('active')) {
          object.parent().addClass('working');
        }
        else {
          object.parent().removeClass('working');
        }
        if (object.parent().hasClass('working')){
          $body.stop(true,false).slideDown({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
        }
        else{
          $body.stop(true,false).slideUp({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
        }
      };
      // Title Checker
      function isTitleChildren(object) {
        var title = getTitle(object);
        return title.length > 0;
      }
      function getTitle(object) {
        return object.closest('li > .title');
      }
      // Add click handler to .title
      element.on('click', '> li > .title', function(e) {
        var $header = $(this),
        element = $(e.target);

        if (isTitleChildren(element)) {
          element = getTitle(element);
        }
        element.toggleClass('active');

        if (element.closest('.collapsible').hasClass('accordion')) { // Handle accordion collapsible
          accordionCollapsible(element);
        } else { // Handle epandable collapsible
          expandableCollapsible(element);

          if ($header.hasClass('active')) {
            expandableCollapsible($header);
          }
        }
      });
      // Open first .content sibling of .title that has .active class
      if (element.closest('.collapsible').hasClass('accordion')) {
        accordionCollapsible($titles.filter('.active').first());
      }
      else {
        $titles.filter('.active').each(function() {
          expandableCollapsible($(this));
        });
      }
      // Close first .content sibling of .title that does not have .active class
      $titles.not('.active').parent().removeClass('working').children('.content').stop(true,false).slideUp({
        duration: 350,
        easing: "easeOutQuart",
        queue: false,
        complete: function() {$(this).css('height', '');}
      });
    });
  };

  // Initialize collapsible
  $(document).ready(function(){
    $('.collapsible').collapsible();
  });

}( jQuery ));

/*!
* Emmandave UI Modal
* Copyright 2016-2017 Folorunso David A.
*/

(function($) {
  // Is iOS?
  IS_IOS = /iPad|iPhone|iPod/.test(navigator.platform);
  // Get scrollbar width
  function getScrollbarWidth() {
    var outer = $("<div>").addClass("scrollWidthGetter1"),
      inner = $("<div>").addClass("scrollWidthGetter2").css("width", "100%"),
      widthNoScroll, widthWithScroll;

    $("body").append(outer);
    outer = $(".scrollWidthGetter1");
    outer.append(inner);
    inner = $(".scrollWidthGetter2");
    outer.css({visibility: "hidden", width: "100px", overflow: "scroll", position: "fixed"})
    widthWithScroll = inner.width();
    outer.remove();
    return 100 - parseInt(widthWithScroll);
  }
  // Lock the screen
  function lockScreen(options) {
    if (IS_IOS) {
      return;
    }
    var $html = $("html"),
      lockedClass = options.lockClass,
      marginRight;
    if (!$html.hasClass(lockedClass)) {
      if ($("body").outerHeight(true) > $(window).height()) {
        options.scrollPOST = $("body").scrollTop();
        marginRight = parseInt($html.css("margin-right")) + getScrollbarWidth();
        $html.css("margin-right", marginRight + "px");
      }
      $("html").add("body").addClass(lockedClass);
    }
  }
  // Unlocks the screen
  function unlockScreen(options) {
    if (IS_IOS) {
      return;
    }
    var $html = $("html"),
      lockedClass = options.lockClass,
      marginRight;
    if ($html.hasClass(lockedClass)) {
      if ($("body").outerHeight(true) > $(window).height()) {
        marginRight = parseInt($html.css("margin-right")) - getScrollbarWidth();
        $html.css("margin-right", marginRight + "px");
      }
      $("html, body").removeClass(lockedClass);
      $("body").scrollTop(options.scrollPOST)
    }
  }
  // on Ctrl+A click fire `onSelectAll` event
  $(window).on("keydown", function(e) {
    if (!(e.ctrlKey && (e.which || e.keyCode) == 65)) {
      return true;
    }
    if ( $("input:focus, textarea:focus").length > 0 ) {
      return true;
    }
    var selectAllEvent = new $.Event("onSelectAll");
    selectAllEvent.parentEvent = e;
    $(window).trigger(selectAllEvent);
    return true;
  });
  // :focusable expression, needed for tabindex in modal
  $.extend($.expr[':'],{
    focusable: function(element){
      var map, mapName, img,
        nodeName = element.nodeName.toLowerCase(),
      isTaonexNotNaN = !isNaN($.attr(element,"taonex"));
      if (nodeName === "area") {
        map = element.parentNode;
        mapName = map.name;
        if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
          return false;
        }
        img = $("img[usemap=#" + mapName + "]")[0];
        return !!img && visible(img);
      }
      var result = isTaonexNotNaN;
      if (/input|select|textarea|button|object/.test(nodeName)) {
        result = !element.disabled;
      }
      else if ("a" === nodeName) {
        result = element.href || isTaonexNotNaN;
      }

      return result && visible(element);

      function visible(element) {
        return $.expr.filters.visible(element) &&
        !$(element).parents().addBack().filter(function() {
          return $.css(this, "visibility") === "hidden";
        }).length;
      }
    }
  });
// Open Modal Function
  $.fn.extend({
    openModal: function (options) {
      var defaults = {
        pluginName: "modal",
        lockClass: "modal-lock",
        overlayClass: "modal-overlay",
        closeOnEsc: true,
        closeOnOverlayClick: true,
        closeOnCancel: true,
        blurring: false,
        ready: undefined,
        complete: undefined,
        top_min: "5%",
        top_max: "10%",
        in_duration: 350,
        out_duration: 300
      };
      // Override defaults
      options = $.extend(defaults, options);
      var $modal = $(this);
      // Disable the opening of more than a modal
      $modal.find(options.triggers).off("click"+options.pluginName);
      if ($modal.data("overlay-click-close") === "false") {
        options.closeOnOverlayClick = false;
      }
      if ($modal.data("close-on-esc") === "false") {
        options.closeOnEsc = false;
      }
      if ($modal.is("[data-back-blur]")) {
        options.blurring = true;
      }
      options.modalID = $modal.attr("id");
      options.modalStyle = $modal.attr("style");
      // Check if $modal is valid to open
      if ($modal.hasClass("open")) {
        return;
      }
      var overlay = $("<div>").addClass(options.overlayClass);
      $modal.removeClass("close").addClass("open").wrap(overlay);
      lockScreen(options);
      $modal = $("#" + options.modalID);
      overlay = $modal.parent("." + options.overlayClass);
      overlay.attr("tabindex", "-1").scrollTop(0).focus();
      // Check if modal is closable on overlay click
      if (options.closeOnOverlayClick && !$modal.hasClass("full-screen")) {
        overlay.on("click."+options.pluginName+" touchstart."+options.pluginName, function (e) {
          var $target = $(e.target);
          if (!$target.is($modal) && (!$modal.find(e.target).length)) {
            $modal.closeModal(options)
          }
        });
      }
      // Check if modal is closable on Esc press
      if (options.closeOnEsc) {
        overlay.on("keyup."+options.pluginName, function(e) {
          if (e.keyCode === 27) {
            $modal.closeModal(options);
          }
        })
      }
      // Check if modal is closeable on .modal-close click
      $modal.find(".modal-close").click(function(e) {$modal.closeModal(options)});

      if($modal) {
        // blur background if neccessary
        if (options.blurring) {
          $("body").addClass("modal-blur");
          overlay.css("background-color", "rgba(0,0,0,0.6)");
        }
        // On highlight all event
        $(window).on("onSelectAll", function(e) {
          e.parentEvent.preventDefault();
          var range = null,
            selection = null,
            selectionElement = $modal.get(0);
          if (document.body.createTextRange) { //ms
            range = document.body.createTextRange();
            range.moveToElementText(selectionElement);
            range.select();
          }
          else if (window.getSelection) { //all others
            selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(selectionElement);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        });
        // On tab press or shift + tab
        overlay.on("keydown."+options.pluginName, function(e) {
          var modalFocusableElements = $(":focusable", $(this));
          if (modalFocusableElements.filter(":last").is(":focus") && (!e.shiftKey && (e.which || e.keyCode) == 9)) {
            e.preventDefault();
            modalFocusableElements.filter(":first").focus();
          }
          if (modalFocusableElements.filter(":first").is(":focus") && (e.shiftKey && (e.which || e.keyCode) == 9)) {
            e.preventDefault();
            modalFocusableElements.filter(":last").focus();
          }
        });
      }
      // Animate overlay and modal
      overlay.css({display: "block", opacity: 0.5});
      $modal.css({display: "block", opacity: 0.5, "top": options.top_min});
      overlay.animate({opacity: 1}, {duration: options.in_duration-100, queue: false});
      $modal.animate({opacity: 1, "top": options.top_max}, {
        duration: options.in_duration,
        queue: false,
        // Handle modal ready callback
        complete: function() {
          if (typeof(options.ready) === "function") {
            options.ready();
          }
        }
      });
    }
  });

  $.fn.extend({
    closeModal: function(options) {
      var $modal = $(this);
      unlockScreen(options);
      if (!$modal.hasClass("open")) {
        return;
      }
      var overlay = $modal.parent("." + options.overlayClass);
      $modal.removeClass("open").addClass("close").children(".modal-close").off("click."+options.pluginName);
      overlay.css("overflow", "hidden").off("keyup."+options.pluginName+" keydown."+options.pluginName+" click."+options.pluginName+" touchdown."+options.pluginName);
      $(window).off("onSelectAll");
      if (options.blurring) {$("body").removeClass("modal-blur")}

      overlay.animate({opacity: 0}, {duration: options.out_duration, queue: false});
      $modal.animate({"top": options.top_min}, {
        duration: options.out_duration,
        queue: false,
        complete: function() {
          $(this).css("display", "none");
          overlay.css("display", "none");
          // Call complete callback
          if (typeof(options.complete) === "function") {
            options.complete();
          }
          $(this).removeAttr("style").attr("style", options.modalStyle);
          $(this).unwrap();
        }
      });
    }
  });

  $.fn.extend({
    modal: function(options) {
      var options = {} || options;
      options.triggers = this;
      return this.each(function() {
        var defaults = {
          pluginName: "modal",
          top_min: "4%"
        };
        // Override defaults
        options = $.extend(defaults, options);

        var modalID = $(this).attr("href") || "#" + $(this).data("target");
        $(this).click(function(e) {
          options.top_min = ($(this).offset().top - $(window).scrollTop()) / 1.15;
          $(modalID).first().openModal(options);
          e.preventDefault();
        });
      });
    }
  });
  // Initialize Modal
  $(document).ready(function(){
    $(".modal-trigger").modal();
  });
})(jQuery);



$(document).ready(function() {
  /** Radio buttons and Checkboxes **/
  var radio = 'input[type="radio"]';
  var checkbox = 'input[type="checkbox"]';

  $(radio).each(function (){
    var virtual = $('<span class="vradio"></span>');
    $(this).after(virtual);
  });
  $(checkbox).each(function (){
    var virtual = $('<span class="vcheckbox"></span>');
    $(this).after(virtual);
  });

  /****************
  *  Range Input  *
  ****************/
  var range_input = 'input[type=range]';
  var range_wrapper = '.range-field';
  var range_type = range_wrapper + " " + range_input;
  var range_mousedown = false;
  var left;

  $(range_type).each(function () {
    var thumb = $('<span class="thumb"><span class="value"></span></span>');
    $(this).after(thumb);
  });

  $(document).on('change', range_type, function(e) {
    var thumb = $(this).siblings('.thumb');
    thumb.find('.value').html($(this).val());
  });

  $(document).on('mousedown touchstart', range_type, function(e) {
    var thumb = $(this).siblings('.thumb');
    var width = $(this).outerWidth();

    // If thumb indicator does not exist yet, create it
    if (thumb.length <= 0) {
      thumb = $('<span class="thumb"><span class="value"></span></span>');
      $(this).after(thumb);
    }

    // Set indicator value
    thumb.find('.value').html($(this).val());

    range_mousedown = true;
    $(this).addClass('active');

    if (!thumb.hasClass('active')) {
      thumb.animate({ height: "1.5rem", width: "1.5rem", top: "-10px", marginLeft: "-0.75rem"}, { duration: 0, easing: 'easeOutExpo' });
    }

    if (e.type !== 'input') {
      if(e.pageX === undefined || e.pageX === null){//mobile
        left = e.originalEvent.touches[0].pageX - $(this).offset().left;
      }
      else{ // desktop
        left = e.pageX - $(this).offset().left;
      }
      if (left < 0) {
        left = 0;
      }
      else if (left > width) {
        left = width;
      }
      thumb.addClass('active').css('left', left);
    }

    thumb.find('.value').html($(this).val());
  });

  $(document).on('mouseup touchend', range_wrapper, function() {
    range_mousedown = false;
    $(this).removeClass('active');
  });

  $(document).on('mousemove touchmove', range_wrapper, function(e) {
    var thumb = $(this).children('.thumb');
    var left;
    if (range_mousedown) {
      if (!thumb.hasClass('active')) {
        thumb.animate({ height: "100%", width: "100%", top: "-10px", marginLeft: "-0.75rem"}, { duration: 0, easing: 'easeOutExpo' });
      }
      if (e.pageX === undefined || e.pageX === null) { //mobile
        left = e.originalEvent.touches[0].pageX - $(this).offset().left;
      }
      else{ // desktop
        left = e.pageX - $(this).offset().left;
      }
      var width = $(this).outerWidth();
      var maL;
      var maR;

      if (left < 0) {
        left = 0;
        maL = 0;
      }
      else if (left > width) {
        left = width - $('.thumb').outerWidth();
        maL = 0;
      }
      thumb.addClass('active').css({left: left, marginLeft: maL});
      thumb.find('.value').html(thumb.siblings(range_type).val());
    }
  });

  $(document).on('mouseout touchleave', range_wrapper, function() {
    if (!range_mousedown) {

      var thumb = $(this).children('.thumb');

      if (thumb.hasClass('active')) {
        thumb.animate({ height: '0', width: '0', top: '0', marginLeft: '-6px'}, { duration: 100 });
      }
      thumb.removeClass('active');
    }
  });


  controllableRange = range_input + '[aria-control]';

  $(document).on('load live change mousedown touchstart mousemove touchmove', controllableRange, function() {
    $(this).each(function() {
      var valueT = $(this).val()
      var attrT = $(this).attr('aria-control');
      var controllerId = '#' + attrT;
      if (controllerId === '#' + attrT) {
        $(controllerId).val(valueT);
      }
    })
  });

  controller = $(controllableRange).each(function() {
    var attrT = $(this).attr('aria-control');
    return $('#' + attrT);
  })

  $(document).on('load live change', controller, function() {
    var valueT = $(controller).val()
    var attrT = $(controller).attr('id');
    if ($(range_input).has('[aria-control = ' + attrT + ']')) {
      $(range_input + '[aria-control = ' + attrT + ']').val(valueT)
    };
  });
});


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

    show: function(e, element, animate) {

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

      if (animate) {
        translate = 'translate(' + (animate.x) + 'px, ' + (animate.y) + 'px)';
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
