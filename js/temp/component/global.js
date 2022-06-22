// Is iOS?
IS_IOS = /iPad|iPhone|iPod/.test(navigator.platform);
// Get scrollbar width
function getScrollbarWidth() {
  var a = $("<div>").addClass("swg1"),
    b = $("<div>").addClass("swg2").css("width", "100%"), wws;
  $("body").append(a);
  a = $(".swg1"); a.append(b); b = $(".swg2");
  a.css({visibility: "hidden", width: "100px", overflow: "scroll", position: "fixed"})
  wws = 100 - parseInt(b.width()); a.remove();
  return wws;
}
// Lock the screen
function lockScreen(options) {
  if (IS_IOS) {return;}
  var $html = $("html"), lc = options.lockClass, mr;
  if (!$html.hasClass(lc) && (!$html.is("[class*='lock']"))) {
    if ($("body").outerHeight(true) > $(window).height()) {
      options.scrollPOS = $("body").scrollTop();
      mr = parseInt($html.css("margin-right")) + getScrollbarWidth();
      $html.css("margin-right", mr + "px");
    }
    $("html").add("body").addClass(lc);
  } else {options.backLocked = true;}
}
// Unlocks the screen
function unlockScreen(options) {
  if (IS_IOS) {return;}
  var $html = $("html"), lc = options.lockClass, mr;
  if (options.backLocked || ($html.is("[class*='lock']") && !$html.hasClass(lc))) {return;}
  if ($html.hasClass(lc)) {
    if ($("body").outerHeight(true) > $(window).height()) {
      mr = parseInt($html.css("margin-right")) - getScrollbarWidth();
      $html.css("margin-right", mr + "px");
    }
    $("html, body").removeClass(lc);
    $("body").scrollTop(options.scrollPOS)
  }
}