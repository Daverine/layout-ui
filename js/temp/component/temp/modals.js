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
        options.scrollPOS = $("body").scrollTop();
        marginRight = parseInt($html.css("margin-right")) + getScrollbarWidth();
        $html.css("margin-right", marginRight + "px");
      }
      $("html").add("body").addClass(lockedClass);
    }
    else {
      options.backLocked = true;
    }
  }
  // Unlocks the screen
  function unlockScreen(options) {
    if (IS_IOS) {
      return;
    }
    if (options.backLocked) {
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
      $("body").scrollTop(options.scrollPOS)
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
        pluginName: "modal-"+($(this).attr("id")),
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
      if (!$modal.is("[data-allow-multiple]")) {
        $modal.find(options.triggers).off("click");
      }
      if ($modal.is("[data-uncloseable]")) {
        options.closeOnOverlayClick = false;
        options.closeOnEsc = false;
      }
      if ($modal.is(".back-blur")) {options.blurring = true;}
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
          if ($("body").hasClass("modal-blur")) {options.preBlur=true;}
          else {$("body").addClass("modal-blur");}
          overlay.css("background-color", "rgba(0,0,0,0.7)");
          if (options.lastFocus.parents(".modal").get().length) {
            options.lastFocus.parents(".modal").addClass("modal-blur-aux");
          }
        }
        if (options.lastFocus.parents(".modal").not(".full-screen").get().length) {
          overlay.css("background-color", "rgba(0,0,0,0.5)");
        }
        if (options.lastFocus.parents(".modal").get().length) {
          options.lastFocus.parents(".modal-overlay").addClass("modal-lock-aux");
          options.lastFocus.parents(".modal").addClass("modal-lock-aux");
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
      // style and Animate overlay and modal
      if ($modal.is(".self-scroll")) {
        overlay.addClass("display-flex");
        options.top_min = 0;
        options.top_max = 0;
        $modal.css("margin", 0);
      } else {overlay.addClass("display-block")}
      overlay.css({opacity: 0.5});
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
      if (options.blurring) {
        if (!options.preBlur) {$("body").removeClass("modal-blur");}
        if (options.lastFocus.parents(".modal").get().length) {
          options.lastFocus.parents(".modal").removeClass("modal-blur-aux");
        }
      }
      if (options.lastFocus.parents(".modal").get().length) {
        options.lastFocus.parents(".modal-overlay").removeClass("modal-lock-aux");
        options.lastFocus.parents(".modal").removeClass("modal-lock-aux");
      }

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
      options.lastFocus.focus();
    }
  });

  $.fn.extend({
    modal: function(options) {
      var options = {} || options;
      options.triggers = $(this);
      return this.each(function() {
        var defaults = {
          top_min: "4%"
        };
        // Override defaults
        options = $.extend(defaults, options);

        var modalID = $(this).attr("href") || "#" + $(this).data("target");
        $(this).click(function(e) {
          options.top_min = ($(this).offset().top - $(window).scrollTop()) / 1.15;
          options.lastFocus = $(this);
          $(modalID).first().openModal(options);
          e.preventDefault();
        });
      });
    }
  });
  // Initialize Modal
  $(document).ready(function() {
    $(".modal-trigger").modal();
  });
})(jQuery);