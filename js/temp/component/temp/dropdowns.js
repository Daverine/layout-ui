/*!
* emmandave UI Dropdown
* Copyright 2016-2017 Folorunso David A.
*/

(function ($) {

  function dropdownClose($this, nameSpace) {
    $this.each(function() {
      var $this = $(this),
        dContent = $this.children(".dropdown-menu");
      dContent.find(".item").not(".dropdown,.xhover,.divider").off("click."+nameSpace);
      $this.removeClass("active");
      dContent.addClass("animating");
      setTimeout(function() {
        dContent.css("display", "none").removeClass("upward downward right-side left-side animating").removeAttr("style")
        dContent.attr("style", $this.data("dd-store"));
      }, 300);
    });
  }

  $.fn.extend({
    showDropdown: function(options) {
      var $this = $(this),
        dContent = $this.children(".dropdown-menu");
      // return if $this has active class.
      if ($this.hasClass("active")) {return}
      $this.addClass("active");
      // store the style attribute of dcontent for later use
      $this.data("dd-store", dContent.attr("style"));
      // check for the constrain width option
      if (options.constrain_width) {dContent.css("max-width", $this.outerWidth());}
      // close dropdown on click out if dropdown is not hoverable
      if (!options.hover) {
        $(document).on("click."+options.pluginName+", touchstart."+options.pluginName, function (e) {
          var $target = $(e.target);
          if (!$target.is($this) && (!$this.find($target).length)) {
            $this.hideDropdown(options);
          }
        });
      }
      // close dropdown on ".item" click
      dContent.find(".item").not(".dropdown,.xhover,.divider").on("click."+options.pluginName, function () {
        $this.hideDropdown(options, true);
      });
      // close dropdown on Esc press
      $(document).on("keyup."+options.pluginName, function(e) {
        if (e.keyCode === 27) {
          if (!dContent.find(".dropdown").hasClass("active")) {
            $this.hideDropdown(options);
          }
        }
      });
      // on dContent .item hover
      dContent.find(".item").not(".xhover,.divider").each(function() {
        $(this).on("mouseenter", function() {$(this).addClass("hover");});
        $(this).on("mouseleave", function() {$(this).removeClass("hover");});
      });
      // Arrow key use.
      var dContentChild = [];
      for (var i = 0; i < dContent.find(".item").not(".xhover,.divider").get().length; i++) {
        dContentChild[i] = dContent.find(".item").not(".xhover,.divider").eq(i);
      }
      $(document).on("keydown."+options.pluginName, function(e) {
        var lastFocus = dContent.find(".item").not(".xhover,.divider").filter(".hover"), nextFocus;
        // up key
        if (e.keyCode === 38) {
          if (lastFocus.is(dContent.find(".item").not(".xhover,.divider").first()) || !(lastFocus)) {
            nextFocus = dContent.find(".item").not(".xhover,.divider").last();
          } else {
            nextFocus = lastFocus.prev();
          }
          nextFocus.addClass("hover");
        }
        if (e.keyCode === 40) {
          if (lastFocus.is(dContent.find(".item").not(".xhover,.divider").last()) || !(lastFocus)) {
            nextFocus = dContent.find(".item").not(".xhover,.divider").first();
          } else {
            nextFocus = lastFocus.next();
          }
          nextFocus.addClass("hover");
        }
      });
      // dimensions and offsets detection
      var windowHeight = window.innerHeight,
        dropdownHeight = $this.outerHeight(),
        dContentHeight = dContent.outerHeight(true),
        offsetLeft = $this.offset().left - 3,
        offsetRight = $(window).width() - ($this.offset().left + $this.outerWidth()) - 3,
        offsetTop = $this.offset().top - $(window).scrollTop(),
        currAlignment = options.alignment,
        gutterSpacing = 0,
        leftPosition = 0,
        availBottom, availTop;
      // select any of $this parents that has a scrollable overflow that is not body and return the first.
      var wrapper = $this.parents().not("body").filter(function () {
        if ($(this).css("overflow") == "auto" ||
          $(this).css("overflow") == "scroll" ||
          $(this).css("overflowY") == "auto" ||
          $(this).css("overflowY") == "scroll") {
          return $(this);
        }
      }).first();
      // Check for available space at the top, bottom, left and right.
      if ($this.hasClass("sub")) {
        availBottom = windowHeight - offsetTop;
        availTop = offsetTop + dropdownHeight;
        // set the left and right offset of a sub dropdown
        if (offsetRight > offsetLeft && offsetRight >= dContent.outerWidth()) {
          dContent.addClass("right-side");
        } else if (offsetLeft > offsetRight && offsetLeft >= dContent.outerWidth()) {
          dContent.addClass("left-side");
        } else if (offsetRight >= offsetLeft) {
          dContent.addClass("right-side").css({"max-width": offsetRight});
          dContentHeight = dContent.outerHeight(true);
        } else if (offsetLeft > offsetRight) {
          dContent.addClass("left-side").css({"max-width": offsetLeft});
          dContentHeight = dContent.outerHeight(true);
        }
      } else if ($(wrapper).length <= 0) {
        availBottom = windowHeight - offsetTop - dropdownHeight;
        availTop = offsetTop;
      } else {
        var offsetTopx = offsetTop - ($(wrapper).offset().top - $(window).scrollTop());
        availBottom = $(wrapper).get(0).clientHeight - offsetTopx - dropdownHeight;
        availTop = offsetTopx;
      }

      if (!$this.hasClass("sub")) {
        if (offsetRight+$this.outerWidth() >= dContent.outerWidth()) {
          dContent.addClass("right-side");
        } else if (offsetLeft+$this.outerWidth() >= dContent.outerWidth()) {
          dContent.addClass("left-side");
        } else if (offsetRight+$this.outerWidth() >= offsetLeft+$this.outerWidth()) {
          dContent.addClass("right-side").css({"max-width": offsetRight+outerWidth});
        } else if (offsetLeft+$this.outerWidth() > offsetRight+$this.outerWidth()) {
          dContent.addClass("left-side").css({"max-width": offsetLeft+outerWidth()});
        }
      }
      var availTop = availTop - 5, availBottom = availBottom - 5;
      // Vertical positioning and dContent Element.
      if (dContentHeight <= availBottom) {dContent.addClass("downward");}
      else if (dContentHeight <= availTop) {dContent.addClass("upward");}
      else {
        if (availBottom >= availTop) {dContent.addClass("downward");}
        else if (availTop + $(window).scrollTop() > dContentHeight) {dContent.addClass("upward");}
        else {dContent.addClass("downward");}
      }
      // open animation
      dContent.css("display", "inline-block").addClass("animating");
      setTimeout(function() {dContent.removeClass("animating")}, 300);
    },
    hideDropdown: function(options, optionEvent) {
      var $this = $(this),
        dContent = $this.children(".dropdown-menu");
      // return if $this does not have the active class.
      if (!$this.hasClass("active")) {return;}
      // off neccessary events
      if (!options.hover) {$(document).off("click."+options.pluginName+", touchstart."+options.pluginName+", keyup."+options.pluginName);}
      dContent.find(".item").not(".dropdown,.xhover,.divider").off("click."+options.pluginName);
      // close any active dropdown that is a desendant of dContent
      dContent.find(".dropdown").filter("active").hideDropdown();
      // close animation
      $this.removeClass("active");
      dContent.addClass("animating");
      setTimeout(function() {
        dContent.css("display", "none").removeClass("upward downward right-side left-side animating").removeAttr("style")
        if ($this.data("dd-store")) {dContent.attr("style", $this.data("dd-store"));}
      }, 300);
      if(optionEvent) {dropdownClose($this.parents(".dropdown"), options.pluginName)}; // Close parent dropdown option click.
    },
    dropdown: function(options) {
      var options = {} || options;
      return this.each(function () {
        var defaults = {
            pluginName: "ui_dropdown",
            constrain_width: false, // Constrains width of dropdown to the activator
            hover: false,
            stopPropagation: true,
            delay: undefined
          },
          // override defaults and update options
          options = $.extend(defaults, options),
          $this = $(this),
          dContent = $this.children(".dropdown-menu");

        // Get options from the dropdown element itself
        if ($this.data("delay") !== undefined) {options.delay = $this.data("delay");}
        if ($this.is("[data-constrainWidth]")) {options.constrain_width = true;}
        if ($this.is("[data-hover]")) {options.hover = true;}
        if ($this.data("stoppropagation") !== undefined) {options.stopPropagation = $this.data("stoppropagation");}

        // Hover handler to show or hide dropdown
        if (options.hover) {
          var showDelayTimer, hideDelayTimer, timeDelay = options.delay || 250;
          $this.on("mouseenter."+options.pluginName, function (e) {
            var $this = $(this);
            clearTimeout(hideDelayTimer);
            showDelayTimer = setTimeout(function() {$this.showDropdown(options);}, timeDelay);
            if ($this.hasClass("active")) {clearTimeout(showDelayTimer)}
          });
          $this.on("mouseleave."+options.pluginName, function(e) {
            var $this = $(this);
            clearTimeout(showDelayTimer);
            hideDelayTimer = setTimeout(function() {$this.hideDropdown(options);}, timeDelay);
            if (!$this.hasClass("active")) {clearTimeout(hideDelayTimer)}
          });
        } else {
          // Click handler to show or hide dropdown
          $this.on("click."+options.pluginName, function (e) {
            var $target = $(e.target), timeDelay = options.delay || 0;
            if (!$target.is(dContent) && (!dContent.find($target).length)) {
              if (!$this.hasClass("active")) {
                e.preventDefault();
                if (options.stopPropagation) { e.stopPropagation();}
                setTimeout(function() {$this.showDropdown(options)}, timeDelay);
              } else {
                e.preventDefault();
                setTimeout(function() {$this.hideDropdown(options)}, timeDelay);
              }
            }
          });
        }
      });
    }
  });
  // Initialize dropdown
  $(document).ready(function(){
    $(".dropdown").dropdown();
  });
}( jQuery ));