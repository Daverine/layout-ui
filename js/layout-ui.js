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

function elemExist(elem) {
	return !($(elem).index() < 0)
}

// set boundaries for highlight all functions
function setHighlightRange(elem) {
	var range, selection;

	if (document.body.createTextRange) {
		range = document.body.createTextRange();
		range.moveToElementText(elem[0]);
		range.select();
	}
	else if (window.getSelection) {
		selection = window.getSelection();
		range = document.createRange();
		range.selectNodeContents(elem[0]);
		selection.removeAllRanges();
		selection.addRange(range);
	}
}

// set a focus boundaries when the tab and shift tab key is used.
function focusRangeOnTab(range, e) {
	var focusableElements = $(":focusable", range);

	if (focusableElements.filter(":last").is(":focus") && (!e.shiftKey && e.keyCode === 9)) {
		e.preventDefault();
		focusableElements.filter(":first").focus();
	}
	else if (focusableElements.filter(":first").is(":focus") && (e.shiftKey && e.keyCode === 9)) {
		e.preventDefault();
		focusableElements.filter(":last").focus()
	}
}

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
	var div = $("<div>").css({
		position: "fixed",
		left: "0",
		width: "100%",
		height: "70px",
		overflow: "scroll"
	}).appendTo("body");

	a = (div[0].offsetWidth - div[0].clientWidth);
	div.remove();

	return (a);
}

// document offset
function documentOffset() {
	return {
		top: Math.max($("html").offset().top, $("body").offset().top),
		left: Math.max($("html").offset().left, $("body").offset().left)
	};
}

// Lock the screen
function lockScreen(lockClass) {
	if (IS_IOS) { return; }

	var
		$html = $("html"),
		scroll = false,
		div = $("<div>").css({
			position: "fixed",
			left: "0",
			width: "100%",
			height: "70px",
		}).appendTo("body"), a;

	a = (window.innerWidth - div[0].offsetWidth);
	div.remove();

	if ($html.hasClass(lockClass)) { return {preLocked: true} }
	if (a > 0) {
		scroll = true;
		$html.css("margin-right", parseInt($html.css("margin-right")) + scrollbarWidth() + "px");
	}

	$html.addClass(lockClass);

	return {preLocked: false, lockClass: lockClass, scroll: scroll, scrollPos: $html.scrollTop()}
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
var uuid = 0;
function getUniqueId(nameSpace) {
	uuid++;

	nameSpace = (nameSpace != undefined && typeof(nameSpace) === "string")
		? nameSpace
		: "unique-id"

	return nameSpace + uuid;
}

// create a regular object from string.
function strObj4rmDOM(param) {
	if (param === undefined) { return; }
	var
		obj = {},
		items = (param || "").replace(/\s/g, '').split(';');
	;

	for (var i=0; i<items.length; i++) {
		var current = items[i].split(':');

		obj[current[0]] = setType(current[1]);
	}

	return obj;
}

function setType(value) {
	if (value == "true") { value = true; }
	else if (value == "false") { value = false; }
	else if (!isNaN(Number(value))) { value = Number(value); }

	return value;
}

// Use this variable to track where escape key is to function
var luiEscTracker = 0;
function getEscTrack() {
	luiEscTracker++;
	return luiEscTracker;
}
function checkEscStatus(trackNo) {
	var status = trackNo === luiEscTracker;
	if (status) { luiEscTracker--; }
	return status;
}

/*!
* Emmandave UI sidebar
* Copyright 2016-2017 Folorunso David A.
*/

(function($, document) {
	$.fn.extend({
		sidebar: function(options) {
			this.each(function() {
				var
					$this = $(this),
					defaults = {
						pluginName: "sidebar", lockClass: "sidebar-lock", dismissible: true,
						scrollLock: false, returnScroll: true, inDuration: 500, outDuration: 500
					},
					options = $.extend(defaults, options),
					sidebar = $($this.attr("href") || "#"+$(this).data("target"))
				;

				sidebar.find(".close").click(function() { sidebar.closeSidebar(options) });

				$this.click(function(e) {
					e.stopPropagation();
					e.preventDefault();

					if (!sidebar.hasClass("active")) { sidebar.openSidebar(options, $this) }
					else if (sidebar.hasClass("active")) { sidebar.closeSidebar(options) }
				})
			})
		},

		openSidebar: function(options, trigger) {
			if ($(this).hasClass("active")) { return }

			var $this = $(this);

			$this.addClass("active");


			if (options.returnScroll) { $this.data("scrollPos", $("body").scrollTop()) }

			if (options.scrollLock) { $this.data("unlockInfo", lockScreen(options.lockClass)) }

			if (options.dismissible) {
				$(document).on("click."+options.pluginName, function(e) {
					var checker = (trigger)
						? !$(e.target).closest($this).length && $(e.target).closest(trigger)
						: !$(e.target).closest($this).length;

					if (checker) { $this.closeSidebar(options) }
				})
			}

			$this.addClass("animating");
			setTimeout(function() { $this.removeClass("animating") }, options.inDuration);
		},

		closeSidebar: function(options) {
			if (!$(this).hasClass("active")) { return }

			var
				$this = $(this),
				unlockInfo = $this.data("unlockInfo"),
				scrollPos = $this.data("scrollPos")
			;

			$this.removeClass("active");

			$(document).off("click."+options.pluginName);
			$this.addClass("animating");
			setTimeout(function() {
				$this.removeClass("animating");

				if (options.scrollLock && unlockInfo !== undefined) { unlockScreen(unlockInfo) }

				if (options.returnScroll && scrollPos !== undefined) { $("body").scrollTop(scrollPos) }
			}, options.outDuration)
		}
	});


	$(document).ready(function() { $(".sidebar-trigger").sidebar() })
})(jQuery, document);

/*!
* Emmandave UI tabs
* Copyright 2016-2017 Folorunso David A.
*/

(function ($, document) {
	function unawareLocationHash(hash) {
		var node = $("#"+hash), fx;

		if (node.length) {
			node.attr("id", "");
			fx = $("<div></div>").css({
				position: "fixed",
				visibility: "hidden",
				top: 0
			}).attr("id", hash).appendTo(document.body);
		}

		location.hash = "#"+hash
		
		if (node.length) {
			fx.remove();
			node.attr("id", hash);
		}
	}

	$.fn.tabs = function() {
		this.each(function() {
			var
				$this = $(this),
				$items = $this.find(".item[href], .item[data-target]"),
				$active = $items.filter("[href='" + location.hash + "']").length
					? $items.filter("[href='" + location.hash + "']")
					: $items.filter("[data-target='" + location.hash.substring(1) + "']").length
						? $items.filter("[data-target='" + location.hash.substring(1) + "']")
						: $items.filter(".active").first().length
							? $items.filter(".active").first()
							: $items.first()
			;


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

				if (cTrigger) {
					var hash = unawareLocationHash(activeHash.slice(1));
					
				}
			}
		})
	}

	$(document).ready(function() { $(".tabs").tabs() })
})(jQuery, document);

/*!
* Layout-UI slider
* Copyright 2016-2017 Folorunso David A.
*/

(function($) {
		$.fn.slider = function(options) {
				this.each(function() {
					var
						defaults = {
							infinite: true,
							slideInterval: 1,
							transitionTiming: 500,
							animation: "fade",
							videoAutoPlay: true,
							videoMute: true,
							autoplay: true,
							autoplayInterval: 5000,
							pauseOnHover: false,
							indicator: true,
							controllable: true,
							nSlides: 1
						},
						options = $.extend(defaults, options),
						$this = $(this),
						slider = $this.find(".slides"),
						slides = slider.find(".slide"),
						allMedia = slides.find("img,video,iframe"),
						activeSlide = slides.filter(".active").length ? slides.filter(".active").first() : slides.first().addClass("active"),
						activeSlideIndex = slides.index(activeSlide), interval = undefined,
						animation = {
							'none': function(current, next) {
								switcher(current, next, 0);
							},

							'fade': function(current, next) {
								current.velocity({opacity: 0}, options.transitionTiming);
								next.velocity({opacity: 1}, options.transitionTiming/10);
								switcher(current, next, options.transitionTiming);
							},

							'scale': function(current, next) {
								current.addClass("scale").velocity({opacity: 0}, {
									duration: options.transitionTiming,
									complete: function() { $(this).removeClass("scale")}
								});
								next.velocity({opacity: 1}, options.transitionTiming/2);
								switcher(current, next, options.transitionTiming);
							},

							'slide': function(current, next) {
								var
									currentIndex = slides.index(current),
									nextIndex= slides.index(next),
									slideAmt = -(nextIndex * (100/options.nSlides)) + "%"
								;
								//slides.velocity({"left": +slideAmt}, {duration: options.transitionTiming});
								slider.velocity({"left": slideAmt}, options.transitionTiming);
								switcher(current, next, options.transitionTiming);
							},

							'scroll': function(current, next) {
								var
									currentIndex = slides.index(current),
									nextIndex= slides.index(next),
									slideAmt = -(nextIndex * (100/options.nSlides)) + "%"
								;

								slider.velocity({"top": slideAmt}, options.transitionTiming);
								switcher(current, next, options.transitionTiming);
							}
						}
					;

					if ($(this).find(".slides").data("anim")) {
						options.animation = $(this).find(".slides").data("anim");
					}

					function slidePositioner(nSlides) {						
						var 
							slideSize = 100/nSlides,
							activeSlideIndex = slides.index(activeSlide)
						;

						slides.each(function(i) {
							var pos = (i-activeSlideIndex)*slideSize;
							if (options.animation == "slide") {
								$(this).css({"left": pos + "%"});
							}
							else if (options.animation == "scroll") {
								$(this).css({"top": pos + "%"});
							}
						})
					}
					
					slidePositioner(options.nSlides);
		
					function playMedia(media) {
						if (!(media && media[0])) return;
						switch(media[0].nodeName) {
							case 'VIDEO':
								if (!options.videomute) {
									media[0].muted = false;
								}

								media[0].play();
								break;

							case 'IFRAME':
								if (!options.videomute) {
									media[0].contentWindow.postMessage('{ "event": "command", "func": "unmute", "method":"setVolume", "value":1}', '*');
								}

								media[0].contentWindow.postMessage('{ "event": "command", "func": "playVideo", "method":"play"}', '*');
								break;
						}
					}

					function pauseMedia(media) {
						switch(media[0].nodeName) {
							case 'VIDEO':
								media[0].pause();
								break;

							case 'IFRAME':
								media[0].contentWindow.postMessage('{ "event": "command", "func": "pauseVideo", "method":"pause"}', '*');
								break;
						}
					}

					function muteMedia(media) {
						switch(media[0].nodeName) {
							case 'VIDEO':
								media[0].muted = true;
								break;

							case 'IFRAME':
								media[0].contentWindow.postMessage('{ "event": "command", "func": "mute", "method":"setVolume", "value":0}', '*');
								break;
						}
					}

					function switcher(current, next, sTime) {
						setTimeout(function() {
							current.removeClass("active");
							next.addClass("active");
							slider.removeClass("animating");
							activeSlideIndex = next.index();
							activeSlide = slides.eq(activeSlideIndex);
						}, sTime);
					}

					function update(index) {
						activeSlideIndex = slides.index(activeSlide);

						var dir = activeSlideIndex < index ? 1 : -1;

						// Wrap around indices.
						if (index >= slides.length && options.infinite)  {
							index = index - slides.length;
						}
						else if (index >= slides.length && !options.infinite) {
							index = slides.length - 1;
						}
						else if (index < 0 && options.infinite) {
							index = slides.length + index;
						}
						else if (index < 0 && !options.infinite) {
							index = 0;
						}

						if (activeSlideIndex == index) {
							return;
						}

						var
							current = slides.eq(activeSlideIndex),
							next = slides.eq(index),
							currentMedia = current.data("media"),
							nextMedia = next.data("media"),
							nSlides = options.nSlides
						;

						if (currentMedia && currentMedia.is('video,iframe')) {
							pauseMedia(currentMedia);
						}

						if (nextMedia && nextMedia.is('video,iframe')) {
							playMedia(nextMedia);
						}

						slider.addClass("animating");
						animation[options.animation](current, next, dir);

						// Update indicators
						if (options.indicator) {
							indicator.eq(activeSlideIndex).removeClass("active");
							indicator.not(indicator.eq(index)).removeClass("active");
							indicator.eq(index).addClass("active");
						}
					}

					slides.each(function(index) {
						var
							slide = $(this),
							media = slide.children("img,video,iframe").eq(0)
						;

						slide.data({"media": media, "sizer": media});

						if (media.length) {
							var placeholder;

							switch(media[0].nodeName) {
								case "IMG":
									var cover = $("<div class='cover-img'></div>")
										.css({"background-image": "url('" + media.attr("src") + "')"});

									if (media.attr("width") && media.attr("height")) {
										placeholder = $("<canvas></canvas>")
											.attr({width:media.attr("width"), height:media.attr("height")});
										media.replaceWith(placeholder);
										media = placeholder;
										placeholder = undefined;
									}
									else {
										media.css({width: "100%", height: "auto"});
									}

									media.css({opacity: 0}).wrap(cover);
									media = cover;
									cover = undefined;
									break;

								case 'IFRAME':
									var src = media[0].src, iframeId = "sw-" + (++playerId);

									media.attr("src", "").on('load', function() {
										if (index !== activeSlideIndex ||
											(index == activeSlideIndex && !options.videoautoplay)) {
											pauseMedia(media);
										}

										if (options.videomute) {
											muteMedia(media);

											var inv = setInterval((function(ic) {
												return function() {
													muteMedia(media);

													if (++ic >= 4) clearInterval(inv);
												}
											})(0), 250);
										}
									}).data('slideshow', $this).attr('data-player-id', iframeId)
										.attr('src', [src, (src.indexOf('?') > -1 ? '&':'?'), 'enablejsapi=1&api=1&player_id='+iframeId].join(''))
										.addClass('absolute cover');

									// disable pointer events
									if(!IS_TOUCH) media.css('pointer-events', 'none');

									placeholder = true;
									break;

								case 'VIDEO':
									media.addClass("absolute cover-obj");
									placeholder = true;

									if (options.videomute) muteMedia(media);
							}

							if (placeholder) {
								var
									canvas = $("<canvas></canvas>")
										.attr({"width": media[0].width, "height": media[0].height}),
									img = $("<img style='width:100%; height:auto;'>")
										.attr("src", canvas[0].toDataURL())
								;

								slide.prepend(img);
								slide.data('sizer', img);
							}
						}
						else {
							slide.data('sizer', slide);
						}
					});

					// dynamically add indicators if enabled
					if (options.indicator) {
						var indicator = $("<ul class='indicator'></ul>");

						slides.filter(".pClones, .aClone").each(function(index) {
							var indicatorItem = $("<li class='item'></li>");

							// Handle clicks on indicators
							indicatorItem.click(function() {
								var $parent = $this, curr_index = $parent.find($(this)).index();

								update(curr_index);
								slider.trigger("sliderPlay");
							});

							indicator.append(indicatorItem);
						});

						$this.append(indicator);
						indicator = $this.find("ul.indicator").children("li.item");
						indicator.eq(activeSlide.index()).addClass("active");
					}

					// Control functions
					slider.on("sliderPause", function() {
						clearInterval(interval);
					});

					slider.on("sliderPlay", function() {
						clearInterval(interval);
						interval = setInterval(function() {
							update(activeSlideIndex + options.slideInterval);
						}, options.autoplayInterval);
					});

					slider.on("sliderPrev", function() {
						activeSlideIndex = slides.index(activeSlide);
						update(activeSlideIndex - options.slideInterval);
						slider.trigger("sliderPlay");
					});

					slider.on("sliderNext", function() {
						activeSlideIndex = slides.index(activeSlide);
						update(activeSlideIndex + options.slideInterval);
						slider.trigger("sliderPlay");
					});

					// dynamically add controll if enabled

					if (options.controllable) {
						var cPrev = $("<button class='c-prev'></button>").appendTo($this);
						cPrev.click(function() { slider.trigger("sliderPrev");});

						var cNext = $("<button class='c-next'></button>").appendTo($this);
						cNext.click(function() { slider.trigger("sliderNext");});

					slider.on("swipeRight swipeLeft", function(e) {
							if (e.type == "swipeLeft") {
								slider.trigger("slideNext");
							}
							else {
								slider.trigger("slidePrev");
							}
						});

						slider.attr("data-anim", options.animation);
						slider.click(function() {
							slider.toggleClass("paused");

							if (slider.hasClass("paused")) slider.trigger("sliderPause");
							else slider.trigger("sliderPlay");
						});
					}

					$(window).resize(function() {
						var heightArr = [], sliderHeight;

						allMedia.each(function() { heightArr.push($(this).outerHeight()); });
						sliderHeight = Math.max.apply(null, heightArr);
						$this.height(sliderHeight);
					});
					$(window).trigger("resize");

					// autoplay if enabled
					if (options.autoplay) slider.trigger("sliderPlay");
			});
		};

		// Initialize slider
		$(document).ready(function(){
				$(".slider").slider();
		});
})(jQuery);

/*!
* Layout-UI Collapsible
* Copyright 2016-2017 Folorunso David A.
*/

(function($, document) {
	$.fn.collapsible = function(options) {
		this.each(function() {
			var
				defaults = {
					duration: 300, accordion: false, allClosable: true, scrollToView: true
				},
				options = $.extend(defaults, options), $this = $(this),
				titleClass = ".c-toggler", $titles = $this.find(titleClass)
			;

			function scrollToView($this) {
				var
					overflowParent = $this.parents().filter(function () {
						if ($(this).css("overflow-y") == "auto" ||
							$(this).css("overflow-y") == "scroll") { return $(this) }
					}).length
						? overflowParent = $this.parents().filter(function () {
							if ($(this).css("overflow-y") == "auto" ||
								$(this).css("overflow-y") == "scroll") { return $(this) }
						}).first()
						: $("body"),
					cHeight = $this.outerHeight() + $this.prev(titleClass).outerHeight(),
					cOffset = $this.prev(titleClass).offset().top, offset = 0, scroll
				;

				if (overflowParent.length) {
					if (overflowParent.is("body") || overflowParent.is("html")) {
						offset = cHeight + cOffset - $(window).height();

						if (offset > (cOffset - overflowParent.offset().top)) {
							offset = cOffset - overflowParent.offset().top - 10
						}

						overflowParent = $("html, body");
						scroll = $(window)
					}
					else {
						offset = cOffset + cHeight + overflowParent.scrollTop() -
							overflowParent.offset().top - overflowParent.outerHeight();

						if (offset > (cOffset + overflowParent.scrollTop() -
							overflowParent.offset().top)) {
							offset = cOffset + overflowParent.scrollTop() -
								overflowParent.offset().top - 10
						}

						scroll = overflowParent
					}
				}
				else {
					overflowParent = $("html, body");
					scroll = $(window)
				}

				if (offset > scroll.scrollTop()) {
					overflowParent.velocity("scroll", {
						offset: offset,
						duration: options.duration,
						easing: "easeOutSine",
						mobileHA: false
					});
				}
			}

			function animateOpen($elem, xPre) {
				$elem.stop(true, false).slideDown({
					duration: options.duration, queue: false,
					complete: function() {
						if (options.scrollToView && xPre) { scrollToView($elem) }
					}
				});
			}

			function animateClose($elem) {
				$elem.stop(true,false).slideUp({ duration: options.duration, queue: false })
			}

			function accordionCollapsible($title, xPre) {
				var
					$content = $title.next(".c-item"),
					$titles = $this.find(titleClass)
				;

				if ($title.hasClass("active")) { animateOpen($content, xPre) }
				else { animateClose($content) }

				$titles.not($title).removeClass("active").each(function() {
					animateClose($(this).next(".c-item"))
				})
			}

			function expandableCollapsible($title, xPre) {
				var $content = $title.next(".c-item");

				if ($title.hasClass("active")) { animateOpen($content, xPre) }
				else { animateClose($content) }
			}

			if ($this.data("duration") != undefined) { options.duration = $this.data("duration") }

			if ($this.hasClass("accordion")) { options.accordion = true }

			if (!$this.hasClass("accordion") && $this.data("accordion") == false) {
				options.accordion = false
			}

			if ($this.data("all-closable") == false) { options.allClosable = false }

			if (!options.allClosable && !$this.find(titleClass).filter(".active").length) {
				$this.find(titleClass).first().addClass("active")
			}

			if (options.accordion) { accordionCollapsible($titles.filter(".active").first()) }
			else {
				$titles.filter(".active").each(function() { expandableCollapsible($(this)) })
			}

			animateClose($titles.not(".active").next(".c-item"));

			$this.click(function(e) {
				var target = $(e.target), $title;

				if (target.closest(titleClass).length) { $title = target.closest(titleClass) }
				else { return }

				if (!options.allClosable &&
					($title.hasClass("active") &&
						$this.find(titleClass).filter(".active").length === 1)) { return }

				$title.toggleClass("active");

				if (options.accordion) { accordionCollapsible($title, true) }
				else { expandableCollapsible($title, true) }
			})
		})
	}

	$(document).ready(function() { $(".collapsible").collapsible() })
})(jQuery, document);

/*!
* Layout-UI scrollSpy
* Copyright 2019-2020 Folorunso Ayoola D.
*/

(function($, window, document, undefined) {
	
	"use strict";

	window = (typeof window != "undefined" && window.Math == Math)
		? window
		: (typeof self != "undefined" && self.Math == Math)
			? self
			: Function('return this')()
	;

	$.fn.extend({
		isElementInView: function(element, settings) {
			if (!element.length) { return false }

			var 
				page = settings.spyTarget ? $($(this).data("scrollspy")) : $(window),
				pageTop = page.scrollTop() + settings.pts,
				pageLeft = page.scrollLeft(),
				pageBottom = pageTop + page.height() - settings.pts,
				pageRight = pageLeft + page.width(),
				elementTop = settings.spyTarget ? $(element).offset().top - page.offset().top + page.scrollTop(): $(element).offset().top,
				elementLeft = settings.spyTarget ? $(element).offset().left - page.offset().left + page.scrollLeft() : $(element).offset().left,
				elementBottom = elementTop + $(element).height(),
				elementRight = elementLeft + $(element).width()
			;

			var result = (
				((elementTop >= pageTop) && (elementTop <= pageBottom)) ||
				((elementBottom >= pageTop) && (elementBottom <= pageBottom)) ||
				((elementTop <= pageBottom) && (elementBottom >= pageTop))
			) && (
				((elementLeft >= pageLeft) && (elementLeft <= pageRight)) ||
				((elementRight >= pageLeft) && (elementRight <= pageRight)) ||
				((elementLeft <= pageRight) && (elementRight >= pageLeft))
			);

			return result;
		},

		scroller: function(scrollAmt, settings) {
			if (typeof(scrollAmt) != "number") {
				var 
					page = $(this),
					element = $(scrollAmt).first(),
					node = $(element.attr("href") || "#" + element.data("target"))
				;

				if (node.length) {
					scrollAmt = page[0].nodeName.toLowerCase() === "html"
						? node.offset().top
						: node.offset().top - page.offset().top + page.scrollTop()
					;
				}
			}

			if (typeof(settings.topSpacing) === "string" && 
				(settings.topSpacing.charAt(settings.topSpacing.length -1) === "%" &&
				!isNaN(Number(settings.topSpacing.slice(0, -1))))
			) {
				settings.topSpacing = (Number(settings.topSpacing.slice(0, -1)))/100 * (page[0].nodeName.toLowerCase() === "html" ? $(window) : page).height();
			}

			if (typeof(scrollAmt) == "number") {
				$(this).velocity("scroll",
					{
						duration: settings.duration || 200,
						offset: scrollAmt - settings.topSpacing,
						easing: "easeOutSine",
						mobileHA: false
					}
				);
			}
		},

		scrollspy: function(options) {
			this.each(function() {
				var
					$this = $(this),
					settings = $.extend({}, {
						namespace: "scrollspy",
						topSpacing: "10%",
						duration: 200,
						spyTarget: ($($this.data("scrollspy")).length) ? true : false
					}, options)
				;
				
				settings.uniqueId = getUniqueId(settings.namespace);

				if (typeof(settings.topSpacing) === "string") {
					$(window).on("resize."+settings.uniqueId, function() {
						if (settings.topSpacing.charAt(settings.topSpacing.length -1) === "%" &&
							!isNaN(Number(settings.topSpacing.slice(0, -1)))
						) {
							var page = settings.spyTarget ? $($this.data("scrollspy")) : $(window);
							settings.pts = (Number(settings.topSpacing.slice(0, -1)))/100 * page.height();
						}
					});
				}

				$(window).trigger("resize."+settings.uniqueId);
				var spyTargetElem = settings.spyTarget ? $($this.data("scrollspy")) : $(window);

				spyTargetElem.on("scroll."+settings.uniqueId, function() {
					var $inView = $this.find(".item[href], .item[data-target]").filter(function() {
						var element = $($(this).attr("href")).length ? $($(this).attr("href")) : $("#" + $(this).data("target"));
						return $this.isElementInView(element, settings)
					}).first();

					if ($inView.length) {
						$inView.addClass("active").siblings().removeClass("active").find(".item").removeClass("active");
						$inView.parentsUntil($this, ".sub.items").each(function() {
							$(this).prevAll(".item").first().addClass("active").siblings().not(this).removeClass("active").find(".item").removeClass("active");
						});
					}
				});

				spyTargetElem.trigger("scroll."+settings.uniqueId);

				$this.click(function(e) {
					var $target = $(e.target);

					if ($target.closest(".item[href], .item[data-target]").length) {
						e.preventDefault();
						var node = settings.spyTarget ? $($this.data("scrollspy")) : $("html");
						node.scroller($target.closest(".item[href], .item[data-target]"), {spyTarget: settings.spyTarget, topSpacing: settings.pts, duration: settings.duration});
					}
				});
			});
		}
	});

	$(document).ready(function() { $("[data-scrollspy]").scrollspy() });
})(jQuery, window, document);

/*!
* Layout-UI scrollPin
* Copyright 2019-2020 David A.
*/

(function($, window, document, undefined) {

	"use strict";

	window = (typeof window != "undefined" && window.Math == Math)
		? window
		: (typeof self != "undefined" && self.Math == Math)
			? self
			: Function('return this')()
	;

	$.fn.scrollPin = function(options) {
		var 
			options = $.extend({}, {
				namespace: "scrollPin",
				className: "pinned",
				sticky: false,
				parentGuide: false,
				topSpacing: 0,
				bottomSpacing: 0,
				zIndex: 9999,
				pinned: undefined,
				unpinned: undefined
			}, options)
		;

		this.each(function(index) {
			var 
				$element = $(this),
				props = {style: $element.attr("style")},
				settings = $.extend({}, options, strObj4rmDOM($element.data("options")))
			;
			
			// adjust settings
			settings.parentGuide = settings.sticky ? true : settings.parentGuide;
			settings.uniqueId = getUniqueId(settings.namespace);


			// update function
			function update() {
				$element.attr("style", props.style || "");
				settings.lastControl = "";
				
				// needed if pinned element needs to be contained inside the parent element"s boundaries
				if (settings.parentGuide) {
					var $parent = $element.parent(), lastScroll;

			 		// ensure that there would be enough space in element offset to contain both settings.topSpacing and settings.bottomSpacing where needed.
			 		if (settings.topSpacing > parseFloat($parent.css("paddingTop")) + parseFloat($element.css("marginTop"))) {
						$element.css("marginTop", settings.topSpacing + 2 - parseFloat($parent.css("paddingTop")));
					}
					if (settings.bottomSpacing > parseFloat($parent.css("paddingBottom")) + parseFloat($element.css("marginBottom"))) {
						$element.css("marginBottom", settings.bottomSpacing + 2 - parseFloat($parent.css("paddingBottom")));
					}

					lastScroll = $(window).scrollTop();
					props.pHeight = $parent.outerHeight();
					props.pOffset = $parent.offset();
				}

				props.offset = $element.offset();
				props.height = $element.outerHeight();
				props.width = $element.outerWidth();

				// determine if a scrollpin should be independent by element's height
				settings.independent = props.height >= $(window).height();

				// ensure that there would be enough space in element offset to contain settings.topSpacing (not for parent guided elements)
				if (settings.topSpacing > props.offset.top) { $element.css("marginTop", settings.topSpacing + 2); }
				
				props.marginT = parseFloat($element.css("marginTop"));
				props.marginB = parseFloat($element.css("marginBottom"));
				props.marginL = parseFloat($element.css("marginLeft"));
				props.marginV = props.marginT + props.marginB;

				// adjust offset with margins
				props.offset.left -= props.marginL;
				props.offset.top -= props.marginT;

				$element.css({
					"zIndex": settings.zIndex
				}).removeClass(settings.className);

				// off a previously set callback function (if any) and re-on the scroll.settings.uniqueId event
				$(window).off("scroll."+settings.uniqueId).on("scroll."+settings.uniqueId, function() {
					var
						scroll = $(window).scrollTop(),
						$rp = $element.parents().not(function() {return ($(this).css("position") == "static")}).first() || $("body") // parent that is not static
					;

					if (settings.independent) {
						// pin the element at the bottom
						if ($element.css("position") != "fixed" &&
							scroll >= lastScroll &&
							$element.offset().top + props.height - props.marginT + settings.bottomSpacing <= scroll + $(window).height() &&
							(!settings.parentGuide || props.pOffset.top + props.pHeight - settings.bottomSpacing - parseFloat($parent.css("padding-bottom")) >= scroll + $(window).height())
						) {
							$element.css({
								"top": $(window).height() - settings.bottomSpacing - props.height - props.marginT,
								"left": props.offset.left,
								"position": "fixed"
							}).addClass(settings.className);
							// fix for the use of relative width on the element.
							$element[0].style.setProperty("width", props.width + "px", "important");
							
							if (settings.pinned && typeof settings.pinned == "function") {
								settings.pinned($element);
							}
							settings.lastControl = "pin1";
						}
						// pin the element at the top
						else if ($element.css("position") != "fixed" &&
							lastScroll >= scroll &&
							$element.offset().top + props.marginT - settings.topSpacing >= scroll &&
							scroll >= props.offset.top + settings.topSpacing
						) {
							$element.css({
								"position": "fixed",
								"top": settings.topSpacing - props.marginT,
								"left": props.offset.left
							}).addClass(settings.className);
							// fix for the use of relative width on the element.
							$element[0].style.setProperty("width", props.width + "px", "important");

							if (settings.pinned && typeof settings.pinned == "function") {
								settings.pinned($element);
							}
							settings.lastControl = "pin2";
						}
						// unpin the element (from been pinned by pin1) if is guided by it parent and it as reach it parent limit at the bottom.
						else if (settings.parentGuide && props.pOffset.top + props.pHeight + settings.bottomSpacing - props.marginB - parseFloat($parent.css("padding-bottom")) <= scroll + $(window).height()) {
							$element.css({
								"top": props.pHeight - props.height - props.marginV - parseFloat($parent.css("padding-bottom")),
								"left": props.offset.left - props.pOffset.left,
								"position": "absolute"
							}).removeClass(settings.className);
							// fix for the use of relative width on the element.
							$element[0].style.setProperty("width", props.width + "px", "important");

							if (settings.unpinned && typeof settings.unpinned == "function") {
								settings.unpinned($element);
							}
							settings.lastControl = "";
						}
						// unpin the element if the page scrolls to where the initial offset of the element is visible
						else if (props.offset.top >= scroll) {
							$element.css({
								"position": "absolute",
								"top": props.offset.top - $rp.offset().top,
								"left": props.offset.left - $rp.offset().left
							}).removeClass(settings.className);
							// fix for the use of relative width on the element.
							$element[0].style.setProperty("width", props.width + "px", "important");

							if (settings.unpinned && typeof settings.unpinned == "function") {
								settings.unpinned($element);
							}
							settings.lastControl = "";
						}
						// unpin element if element was pinned by pin1 and the scroll direction for been pinned has change
						else if (settings.lastControl == "pin1" && lastScroll > scroll) {
							$element.css({
								"top": lastScroll + $(window).height() - props.offset.top + props.offset.top - $rp.offset().top - props.height - settings.bottomSpacing,
								"left": props.offset.left - $rp.offset().left,
								"position": "absolute"
							}).removeClass(settings.className);
							// fix for the use of relative width on the element.
							$element[0].style.setProperty("width", props.width + "px", "important");

							if (settings.unpinned && typeof settings.unpinned == "function") {
								settings.unpinned($element);
							}
							settings.lastControl = "";
						}
						// unpin element if element was pinned by pin2 and the scroll direction for been pinned has change
						else if (settings.lastControl == "pin2" && scroll > lastScroll) {
							$element.css({
								"top": lastScroll - $rp.offset().top, // lastScroll - props.pOffset.top + settings.topSpacing,
								"left": props.offset.left - $rp.offset().left,
								"position": "absolute"
							}).removeClass(settings.className);
							// fix for the use of relative width on the element.
							$element[0].style.setProperty("width", props.width + "px", "important");

							if (settings.unpinned && typeof settings.unpinned == "function") {
								settings.unpinned($element);
							}
							settings.lastControl = "";
						}
					}
					else {
						// pin element at the top if element has been scrolled out of page (from top)
						// also if element is guided by parent, the parent must have enough visible area to contain the element and its top spacing
						// and if element is sticky, then the user must be scrolling down \/ and the element must not be recently unpined by unpin2
						if (
							(!settings.sticky || (scroll >= lastScroll && settings.lastControl != "unpin2")) &&
							scroll >= props.offset.top + props.marginT - settings.topSpacing &&
							(!settings.parentGuide || props.pHeight + props.pOffset.top - scroll > props.height + settings.topSpacing + parseFloat($parent.css("padding-bottom"))) &&
							$element.css("position") != "fixed"
						) {
							$element.css({
								"position": "fixed",
								"top": settings.topSpacing - props.marginT,
								"left": props.offset.left
							}).addClass(settings.className);
							// fix for the use of relative width on the element.
							$element[0].style.setProperty("width", props.width + "px", "important");

							if (settings.pinned && typeof settings.pinned == "function") {
								settings.pinned($element);
							}
							settings.lastControl = "pin1";
						}
						// pin element at the bottom if element is sticky
						// and was recently unpined by unpin2
						// and the user is scrolling the page up /\
						// also the parent of sticky has enough space in the viewport to contain the element
						else if (settings.sticky && settings.lastControl == "unpin2" && scroll < lastScroll &&							
							props.pOffset.top + props.pHeight >= scroll + $(window).height() &&
							$element.offset().top + props.height + settings.bottomSpacing >= $(window).height() + scroll &&
							$element.css("position") != "fixed"
						) {
							$element.css({
								"position": "fixed",
								"top": $(window).height() - props.height - settings.bottomSpacing - props.marginT,
								"left": props.offset.left
							}).addClass(settings.className);
							// fix for the use of relative width on the element.
							$element[0].style.setProperty("width", props.width + "px", "important");

							if (settings.pinned && typeof settings.pinned == "function") {
								settings.pinned($element);
							}
							settings.lastControl = "pin2";
						}
						// unpin the element if the page scrolls to where the initial offset of the element is visible
						// but element must not be sticky
						// else element must not be recently pined by pin2
						// else user must be scrolling up /\ and must have scroll to the initial position of the element
						else if (scroll + settings.topSpacing <= props.offset.top + props.marginT &&
							(!settings.sticky || (settings.lastControl != "pin2" || (scroll <= lastScroll && $element.offset().top - props.marginT <= props.offset.top))) &&
							$element.css("position") != "absolute"
						) {
							$element.css({
								"position": "absolute",
								"left": props.offset.left - $rp.offset().left,
								"top": props.offset.top - $rp.offset().top,
							}).removeClass(settings.className);
							// fix for the use of relative width on the element.
							$element[0].style.setProperty("width", props.width + "px", "important");

							if (settings.unpinned && typeof settings.unpinned == "function") {
								settings.unpinned($element);
							}
							settings.lastControl = "unpin1";
						}
						// unpin element and make it stay at the bottom of parent if it is parent guided
						// and the page has scrolled reach or past the parent
						// and if element was recently pined by pin2, the user must be scrolling down \/ the page
						// must have reach or scrolled the parent out of viewport
						else if (
							settings.parentGuide &&
							(scroll >= props.pOffset.top + props.pHeight - props.height - settings.topSpacing - props.marginB - parseFloat($parent.css("padding-bottom")) ||
								(settings.lastControl == "pin2" && scroll > lastScroll && props.pOffset.top + props.pHeight <= scroll + $(window).height())) &&
							$element.css("position") != "absolute"
						) {
							$element.css({
								"position": "absolute", 
								"top": props.pHeight - parseFloat($parent.css("padding-bottom")) - props.height - props.marginV,
								"left": props.offset.left - props.pOffset.left
							}).removeClass(settings.className);
							// fix for the use of relative width on the element.
							$element[0].style.setProperty("width", props.width + "px", "important");

							if (settings.unpinned && typeof settings.unpinned == "function") {
								settings.unpinned($element);
							}
							settings.lastControl = "unpin2";
						}
					}
					lastScroll = scroll;
				});

				// trigger the scroll event so that computations take effect
				$(window).trigger("scroll." + settings.uniqueId); 
			}

			// update elements" position
			update();

			// on window resize update elements" position
			$(window).on("resize", update);
		});
	};

	$(document).ready(function() {
		$(".scroll-pin").scrollPin();
	});
})(jQuery, window, document);

/*!
* Layout UI Search Filter
* Copyright 2020 Folorunso Ayoola D.
*/

(function ($, window, document, undefined) {
	"use strict";

	window = (typeof window != "undefined" && window.Math == Math)
		? window
		: (typeof self != "undefined" && self.Math == Math)
			? self
			: Function('return this')()
	;

	$.fn.searchFilter = function() {
		$(this).each(function() {
			var
				$this = $(this),
				list = $("#"+$this.data("filter")),
				listItems = list.find($this.data("selector") || "> *:not(.xhover):not(.disabled)")
			;

			if ($this[0].nodeName.toUpperCase() === "INPUT" || $this.is("[contenteditable]")) {
				$this.on("keyup.searchFilter", function(e) {
					if ((e.keyCode > 36 && e.keyCode < 41) || e.ctrlKey || e.altKey || e.metaKey) { return false; }

					var filter = $(this).val() || $(this).text(), txtValue;

					for (var i = 0; i < listItems.length; i++) {
						txtValue = $(listItems[i]).text().toUpperCase();

						if (txtValue.indexOf(filter.toUpperCase()) !== 0) { $(listItems[i]).addClass("filtered"); }
						else { $(listItems[i]).removeClass("filtered"); }
					}
					
					if (listItems.filter(".active").length) { listItems.filter(".active").addClass("hovered"); }
					else { listItems.first().addClass("hovered"); }
					
					if (!listItems.length) {
						if (!list.children(".ed-msg").length) {
							$("<div class='ed-msg'>No result found.</div>").appendTo(list);
						}
					}
					else { list.children(".ed-msg").remove(); }

					list.trigger("refresh");
				});

				$this.trigger("keyup.searchFilter");
			}
		});
	}

	$(document).ready(function() { $("[data-filter]").searchFilter(); });

})(jQuery, window, document);

/*!
* Layout UI Dropdown
* Copyright 2016-2020 Folorunso David A.
*/

(function ($, window, document, undefined) {

	"use strict";

	window = (typeof window != "undefined" && window.Math == Math)
		? window
		: (typeof self != "undefined" && self.Math == Math)
			? self
			: Function('return this')()
	;

	var ddTemp = {
		mouseTarget: false
	};

	$(document).on("mousemove.dd", function(e) {
		ddTemp.mouseTarget = $(e.target);
	});

	$(document).ready(function() {
		$(document).on("click.dd", ".dropdown:not([data-findTrigger]):not([data-hover]):not(.sub), .dropdown.sub[data-hover='false']:not([data-findTrigger]), " +
			".dropdown[data-findTrigger]:not([data-hover]):not(.sub) > .trigger, .dropdown.sub[data-hover='false'][data-findTrigger] > .trigger", function (e) {
			$(e.target).dropdownInit(e);
		});
		
		$(document).on("mouseenter.dd",
			".dropdown[data-hover]:not([data-findTrigger]), .dropdown.sub:not([data-hover=false]):not([data-findTrigger]), "+
			".dropdown[data-hover][data-findTrigger] > .trigger, .dropdown.sub:not([data-hover=false])[data-findTrigger] > .trigger", function(e) {
			$(e.target).dropdownInit(e);
		});

		$(document).on("touchstart.dd", ".dropdown[data-hover]:not([data-findTrigger]), .dropdown.sub:not([data-hover=false]):not([data-findTrigger]), "+
		".dropdown[data-hover][data-findTrigger] > .trigger, .dropdown.sub:not([data-hover=false])[data-findTrigger] > .trigger", function(e) {
			$(e.target).dropdownInit(e);
		});

		$(".dropdown").dropdownInit();
	});

	$.fn.extend({
		dropdownInit: function(e) {
			$(this).each(function() {
				var
					$target = $(this),
					dropdown = $target.closest(".dropdown"),
					searchBox = dropdown.children("input.search"),
					sContent = dropdown.children(".content"),
					settings, uniqueId, dropdownMenu
				;

				if (dropdown.data("initialized")) {
					settings = dropdown.data("settings");
					uniqueId = dropdown.data("uniqueId");
				}
				else {
					settings = dropdown.dropdownSettings();
					uniqueId = getUniqueId(settings.pluginName);
				}

				dropdownMenu = (settings.browser)
					? $(settings.menuId).data("browsed", true)
					: dropdown.children(".drop.menu, .drop-board")
				;
				settings.e = e;
				dropdownMenu.attr("data-view", settings.view);

				if (!dropdown.data("initialized")) {
					if (settings.page) { dropdownMenu.addClass("fixed"); }
					/* open dropdown if the enter key or arrow down key is pressed && dropdown has :focus */
					$(document).on("keydown.ms0"+uniqueId, function(e) {
						if ((e.key === "Enter" || e.key === "ArrowDown") && $(":focus").closest(dropdown).length && !dropdown.hasClass("active")) {
							e.preventDefault();
							dropdown.showDropdown(settings, true);
						}
					});
					
					/* create search box for search dropdown */
					if (settings.selectable && dropdown.hasClass("search")) {
						dropdown.prepend("<input class='search' autocomplete='off' tabindex='0'></div>");
						dropdown.removeAttr("tabindex");
						searchBox = dropdown.children("input.search");
						if (dropdown.hasClass("multiple")) {
							searchBox.after("<span class='sizer'>");
						}
					}
					/* create the content box for select dropdown */
					if (settings.selectable && !dropdown.children(".content").length) {
						sContent = $("<div class='content'></div>").prependTo(dropdown);
					}

					if (settings.selectable && dropdown.hasClass("search")) {
						/* open dropdown if user typed in the searchbox */
						searchBox.on("input.ms"+uniqueId, function(e) {
							if (searchBox.val().length) {
								sContent.add(dropdown.children(".placeholder")).addClass("filtered");
							}
							else {
								sContent.add(dropdown.children(".placeholder")).removeClass("filtered");
							}
							
							searchBox.css("width", dropdown.children("span.sizer").text(searchBox.val()).innerWidth());
							dropdown.showDropdown(settings, true);
						});
					}

					if (settings.selectable && dropdown.hasClass("multiple")) {
						$(document).on("click.ms"+uniqueId, function(e) {
							var $target = $(e.target);
							/* deselecting multiple dropdown item when not opened */
							if (!dropdown.hasClass("active") && $target.closest(dropdown.find(".content > .label > .close")).length) {
								var
									sItem = $target.closest(dropdown.find(".content > .label")),
									sInput = dropdown.children("input[type=hidden]"),
									sIValue = sInput.data("value")
								;
								
								sIValue.splice(sItem.index(), 1);
								sInput.data("value", sIValue).val(sIValue);
								dropdownMenu.find("> .item, > .items > .item").not(".xhover,.disabled").eq(sItem.data("index")).removeClass("selected");
								sItem.remove();

								if (dropdownMenu.find("> .item, > .items > .item").not("xhover,.disabled,.selected").length && $("#sm"+uniqueId).length) {
									$("#sm"+uniqueId).remove();
								}
								
								if (dropdown.hasClass("active")) { dropdownMenu.trigger("refresh"); }
							}
							else if ($target.closest(dropdown.find(".content > .label:not(.active)")).length) {
								var  cc = $target.closest(dropdown.find(".content > .label")).addClass("active");

								if (!e.ctrlKey) { cc.siblings(".label").removeClass("active"); }
							}
							else if ($target.closest(dropdown.find(".content > .label.active"))) {
								var cc = $target.closest(dropdown.find(".content > .label.active")).removeClass("active");
			
								if (!e.ctrlKey) { cc.siblings(".label").removeClass("active"); }
							}
							else if (!$target.closest(dropdown.find(".content > .label")).length && dropdown.find(".content > .label").hasClass("active")) {
								dropdown.find(".content > .label").removeClass("active");
							}
						});

						$(document).on("keydown.ms1"+uniqueId, function(e) {
							if (dropdown.find(".content > .label.active").length) {
								if (e.key === "Backspace" || e.key === "Delete") {
									var cc = dropdown.find(".content > .label.active");

									if (e.key === "Backspace" && cc.first().prev().length) { cc.first().prev().addClass("active"); }
									else if (e.key === "Backspace" && cc.last().next().length) { cc.last().next().addClass("active"); }
									else if (e.key === "Delete" && cc.last().next().length) { cc.last().next().addClass("active"); }
									else if (e.key === "Delete" && cc.first().prev().length) { cc.first().prev().addClass("active"); }

									cc.children(".close").trigger("click");
								}
								else if (e.key === "ArrowDown") {
									dropdown.find(".content > .label").removeClass("active");
									dropdown.showDropdown(settings, true);
								}
								else if (e.key === "ArrowRight") {
									var cc = dropdown.find(".content > .label.active").last();
									if (cc.next().length) {
										cc.next().addClass("active");
										if (!e.shiftKey) { cc.removeClass("active").siblings().not(cc.next()).removeClass("active"); }
									}
								}
								else if (e.key === "ArrowLeft") {
									var cc = dropdown.find(".content > .label.active").first();
									if (cc.prev().length) {
										cc.prev().addClass("active");
										if (!e.shiftKey) { cc.removeClass("active").siblings().not(cc.prev()).removeClass("active"); }
									}
								}
							}
							/* delete the last label in multiple dropdown if searchbox is focused on and seachbox is empty and the backspace key is pressed */
							else if (dropdown.hasClass("search") && e.key === "Backspace" && !searchBox.val().length && searchBox.is(":focus") && dropdown.find(".content > .label").length) {
								dropdown.find(".content > .label > .close").last().trigger("click");
								return false;
							}
						});
					}

					/* set select dropdown value for preselected value */
					if (settings.selectable) {
						var
							directItems = dropdownMenu.find("> .item, > .items > .item"),
							sInput = dropdown.children("input[type=hidden]"),
							sContent = dropdown.children(".content") 
						;

						if (dropdown.hasClass("multiple") && directItems.filter(".selected").length) {
							directItems.filter(".selected").each(function() {
								var sItem = $(this), sIValue = sInput.data("value") || [];

								sIValue.push(sItem.data("value") || sItem.text());
								sInput.data("value", sIValue).val(sIValue);
								$("<div class='compact label'>"+sItem.html()+"<i class='close i-close icon'></i></div>").data("index", sItem.index()).appendTo(sContent);

								if (!dropdownMenu.find("> .item, > .items > .item").not("xhover,.disabled,.selected").length) {
									$("<div id='sm"+uniqueId+"' class='ed-msg'>All available item is selected.</div>").appendTo(dropdownMenu);
								}
							});
						}
						else if (!dropdown.hasClass("multiple") && directItems.filter(".active").length) {
							var sItem = directItems.filter(".active").first();

							sItem.siblings().removeClass("active");
							sInput.val(sItem.data("value") || sItem.text());
							sContent.html(sItem.html());
						}
					}

					dropdown.data({
						uniqueId: uniqueId,
						settings: settings,
						initialized: true
					});
				}

				if (typeof(e) === "object") {
					if ($(e.target).closest(dropdown.find(".content > .label")).length) { return; }

					if (settings.hover) {
						var 
							Triggerer = dropdown.add(dropdownMenu),
							timeDelay = settings.delay || 300,
							checker = dropdown.add(dropdownMenu)
						;

						/* checkerFill is a function to find all sub dropdownMenu
							 that was linked to it dropdown (ie the Triggerer) by id and
							 add it to the checker variable. */
							 
						function checkerFill(x) {
							if (x.find(".dropdown").filter("[data-target]").length) {
								$(x.find(".dropdown").filter("[data-target]")).each(function() {
									checker.add("#" + $(this).data("target"));
									checkerFill($("#" + $(this).data("target")));
								});
							}
							else if (x.find(".dropdown").filter("[href]").length) {
								$(x.find(".dropdown").filter("[href]")).each(function() {
									checker.add($(this).attr("href"));
									checkerFill($($(this).attr("href")));
								});
							}
						}

						checkerFill(dropdownMenu);

						if (e.type === "mouseenter") {
							Triggerer.one("mouseleave."+uniqueId, function(e) { dropdown.dropdownInit(e); });
							clearTimeout(ddTemp["hdt"+uniqueId]);
							ddTemp["sdt"+uniqueId] = setTimeout(function() {
								dropdown.showDropdown(settings, dropdown.hasClass("search") ? true : false)
							}, timeDelay*3/4);
						}
						else if (e.type === "mouseleave") {
							clearTimeout(ddTemp["sdt"+uniqueId]);
							ddTemp["hdt"+uniqueId] = setTimeout(function() {
								if (ddTemp.mouseTarget.closest(checker).length) {
									Triggerer.one("mouseleave."+uniqueId, function(e) { dropdown.dropdownInit(e); });
								}
								else { dropdown.hideDropdown(settings); }
							}, timeDelay);
						}
						else if (e.type === "touchstart") {
							if (dropdown.hasClass("active")) {
								clearTimeout(ddTemp["sdt"+uniqueId]);
								ddTemp["hdt"+uniqueId] = setTimeout(function() {
									dropdown.hideDropdown(settings);
								}, timeDelay/2);
							}
							else {
								Triggerer.one("mouseleave."+uniqueId, function(e) { dropdown.dropdownInit(e); });
								clearTimeout(ddTemp["hdt"+uniqueId]);
								ddTemp["sdt"+uniqueId] = setTimeout(function() {
									dropdown.showDropdown(settings, dropdown.hasClass("search") ? true : false)
								}, timeDelay*3/4);
							}
						}
					}
					else {
						var timeDelay = settings.delay || 0;

						if (!$target.closest(dropdownMenu).length) {
							e.preventDefault();
							
							if (dropdown.hasClass("active")) {
								if (dropdown.hasClass("search")) {
									searchBox.trigger("focus");
									return;
								}
								setTimeout(function() {
									dropdown.hideDropdown(settings)
								}, timeDelay)
							}
							else {
								setTimeout(function() {
									dropdown.showDropdown(settings, dropdown.hasClass("search") ? true : false)
								}, timeDelay)
							}
						}
					}
				}
				/* provision for programatically opening and closing a dropdown */
				else {
					if (!dropdown.hasClass("active") && e === true) {
						setTimeout(function() {
							dropdown.showDropdown(settings, true)
						}, timeDelay)
					}
					else {
						setTimeout(function() {
							dropdown.hideDropdown(settings)
						}, timeDelay)
					}
				}
			});
		},

		dropdownSettings: function() {
			var
				dropdown = $(this),
				personalSettings = strObj4rmDOM(dropdown.data("options")),
				settings = $.extend({}, {
						pluginName: "dropdown", constrainWidth: false,
						fluidMinWidth: false, delay: 0, duration: 300,
						closeOnItemClick: true
					}, personalSettings)
			;

			settings.view = ((dropdown.hasClass("sub") && settings.view != "vertical") ||
				settings.view == "horizontal")
				? "horizontal" : "vertical"
			;
			settings.hover = (dropdown.is("[data-hover]") || (dropdown.hasClass("sub") && !dropdown.is("[data-hover=false]"))) ? true : false;
			settings.page = ((settings.page && !dropdown.hasClass("sub")) && !settings.hover) ? true : false;
			settings.browser = (dropdown.hasClass("browse")) ? true : false;
			settings.menuId = (settings.browser) ? dropdown.attr("href") || "#" + dropdown.data("target") : undefined;
			settings.selectable = (dropdown.hasClass("select") || dropdown.hasClass("selection")) ? true : false;

			return settings;
		},

		showDropdown: function(settings, keyboard) {
			if ($(this).hasClass("active") || $(this).hasClass("disabled") || $(this).is("[disabled]")) { return }

			var
				dropdown = $(this),
				dropdownMenu = ((settings.browser)
					? dropdownMenu = $(settings.menuId)
					: dropdown.children(".drop.menu, .drop-board")),
				items = dropdownMenu.find(".item").not(".xhover,.disabled"),
				directItems = dropdownMenu.find("> .item, > .items > .item").not(".xhover,.disabled,.filtered"+(!dropdown.is(".indicating.multiple") ? ",.selected":"")),
				sInput = dropdown.children("input[type=hidden]"),
				sContent = dropdown.children(".content"),
				uniqueId = dropdown.data("uniqueId"),
				EscTrack = getEscTrack()
			;

			if (settings.selectable && dropdown.hasClass("search")) {
				var searchBox = dropdown.children("input.search").focus();
				
				// what to do when searching in a dropdown box
				searchBox.on("input."+uniqueId, function(e) {					
					var filter = searchBox.val().toUpperCase(), txtValue;

					directItems = dropdownMenu.find("> .item, > .items > .item").not(".xhover,.disabled"+(!dropdown.is(".indicating.multiple") ? ",.selected":""));

					for (var i = 0; i < directItems.length; i++) {
						txtValue = $(directItems[i]).text().toUpperCase().trim();

						if (txtValue.indexOf(filter.trim()) !== 0) { $(directItems[i]).addClass("filtered"); }
						else { $(directItems[i]).removeClass("filtered"); }
					}
					
					directItems = dropdownMenu.find("> .item, > .items > .item").not(".xhover,.disabled,.filtered"+(!dropdown.is(".indicating.multiple") ? ",.selected":""));

					if (!directItems.length) {
						dropdownMenu.find("> .item, > .items > .item").removeClass("hovered");
						
						if (filter.length && !dropdownMenu.children(".ed-msg").length) {
							$("<div class='ed-msg'>No result found.</div>").appendTo(dropdownMenu);
						}
					}
					else { dropdownMenu.children(".ed-msg").remove(); }
					
					dropdownMenu.trigger("refresh");
				});

				searchBox.trigger("input."+uniqueId);
			}

			dropdown.addClass("active");

			// Refreshing dropdown menu allows the menu to recalculate it position and optionally re-highlight the necessary item.
			dropdownMenu.on("refresh."+uniqueId, function(e, noHighlight) {
				directItems = dropdownMenu.find("> .item, > .items > .item").not(".xhover,.disabled,.filtered"+(!dropdown.is(".indicating.multiple") ? ",.selected":""));
				$(window).trigger("resize." + uniqueId);
				// highlight (add .hover class) the active item or the first item in the menu list (default action)
				if (!noHighlight && !directItems.filter(".hovered").length) {
					(directItems.filter(".active").length
						? directItems.filter(".active").addClass("hovered")
						: directItems.first().addClass("hovered")
					).siblings().removeClass("hovered");
					$(document).one("mousemove.1"+uniqueId, mouseMover);
				}
			});

			$(document).on("click."+uniqueId, function(e) {
				var $target = $(e.target);

				/* Close on "Click Out" */
				if (!$target.closest(dropdown).length && !$target.closest(dropdownMenu).length) {
					if (settings.selectable) { setSelect(); }
					else { dropdown.hideDropdown(settings); }
				}
				/* do something when an item is clicked */
				else if ($target.closest(dropdownMenu.find("> .item, > .items > .item").not(".disabled,.xhover,.selected")).length) {
					if ($target.closest(".item").hasClass("dropdown")) { return; }
					if (settings.selectable) { 
						setSelect($target.closest(".item"), (dropdown.hasClass("multiple") ? true : false));
					}
					else if (settings.closeOnItemClick && !($target.closest(".item").hasClass("dd-xclose")) || $target.closest(".item").hasClass("dd-close")) { dropdown.hideDropdown(settings, true); }
				}
				/* deselecting items for multiple select dropdown */
				else if ($target.closest(dropdown.find("> .content > .label > .close")).length) {
					var
						sItem = $target.closest(dropdown.find("> .content > .label")),
						sIValue = sInput.data("value")
					;
					
					sIValue.splice(sItem.index(), 1);
					sInput.data("value", sIValue).val(sIValue);
					dropdownMenu.find("> .item, > .items > .item").not(".xhover,.disabled").eq(sItem.data("index")).removeClass("selected");
					sItem.remove();
					setDeselect();
				}
				else if ($target.closest(dropdownMenu.find("> .item, > .items > .item").not(".xhover,.disabled").filter(".selected")).length) {
					var
						sItem = $target.closest(dropdownMenu.find("> .item, > .items > .item").not(".xhover,.disabled").filter(".selected")),
						sIValue = sInput.data("value"),
						scItem = dropdown.find("> .content > .label").filter(function() {return $(this).data("index") === sItem.index()})
					;

					sIValue.splice(scItem.index(), 1);
					sInput.data("value", sIValue).val(sIValue);
					sItem.removeClass("selected");
					scItem.remove();
					setDeselect();
				}
			});

			// Escape key and Tab key (Use to close dropdown) support
			$(document).on("keyup."+uniqueId, function(e) {
				if ((e.keyCode === 27 && checkEscStatus(EscTrack)) || (e.keyCode === 9 && (!$(":focus").closest(dropdown).length || !$(":focus").closest(dropdownMenu).length) &&
					!dropdownMenu.find(".dropdown.active").length)) {
					e.preventDefault();
					if (settings.selectable) { setSelect(); }
					else { dropdown.hideDropdown(settings, (e.keyCode === 9 ? true : false)); }				}
			});

			$(document).on("keydown." + uniqueId, function(e) {
				/*
					The Enter key triggers the click action on an item
					Enter and right arrow key open a sub dropdown that is hovered.
				*/
				if (e.keyCode === 13 || e.keyCode === 39) {
					if (dropdownMenu.find("> .item.hovered.dropdown, > .items > .item.hovered.dropdown").not(".active").length) {
						e.preventDefault();
						dropdownMenu.find("> .item.hovered.dropdown, > .items > .item.hovered.dropdown").first().dropdownInit(true);
					}
					else if (e.keyCode === 13 &&
					dropdownMenu.find("> .item.hovered, > .items > .item.hovered").length) {
						e.preventDefault();
						dropdownMenu.find("> .item.hovered, > .items > .item.hovered").first()[0].click();
					}
				}
				/* Arrow left key (Use to close a sub dropdown) support */
				else if ((e.keyCode === 37 && dropdown.hasClass("sub")) && !dropdownMenu.find(".dropdown.active").length) {
					if (e.isDefaultPrevented()) { return }
					
					e.preventDefault();
					dropdown.hideDropdown(settings);
				}
				/* Up and down arrrow key navigation on dropdown menu item. */
				else if ((e.keyCode === 38 || e.keyCode === 40)) {
					if (!dropdownMenu.find(".dropdown.active").length) {
						e.preventDefault();
						dropdown.off("mouseenter."+uniqueId+" mouseleave."+uniqueId);
						
						var	lfii = (directItems.filter(".hovered").length)
								? directItems.index(directItems.filter(".hovered").first())
								: (directItems.filter(".active").length)
									? directItems.index(directItems.filter(".active").first())
									: -1,
							nfii, lfi
						;

						if (e.keyCode === 38) {
							if (lfii <= 0) { nfii = directItems.length - 1 }
							else { nfii = lfii - 1 }
						}
						else if (e.keyCode === 40) {
							if (lfii === directItems.length -1 || lfii < 0) { nfii = 0 }
							else { nfii = lfii + 1 }
						}

						lfi = directItems.eq(nfii);

						/* Enable scroll of overflow parent to hovered-item to make the hovered item visible */
						if (lfi.length) {
							var
								getIop = lfi.parentsUntil(dropdownMenu).filter(function() {
									return ($(this).css("overflow-y") == "auto" || $(this).css("overflow-y") == "scroll")
								}).first(),
								iOp = getIop.length ? getIop : dropdownMenu,
								dScroll = iOp.scrollTop(),
								dHeight = iOp.height(),
								eHeight = lfi.outerHeight(true),
								eTop = lfi.offset().top - iOp.offset().top + dScroll,
								oDif = dScroll + dHeight - eTop,
								sAmt = e.keyCode === 38
									? ((nfii === directItems.length - 1 && eHeight > oDif) || dScroll > eTop)
										? eTop
										: eTop > (dScroll + dHeight - eHeight)
											? eTop - dHeight + (eHeight*2)
											: undefined 
									: e.keyCode === 40
										? ((nfii === 0 && dScroll > eTop) || eHeight > oDif)
											? dScroll + eHeight - oDif
											: dScroll > eTop
												? eTop - eHeight
												: undefined
										: undefined
							;

							iOp.scrollTop(sAmt);
						}
						
						directItems.removeClass("hovered");
						lfi.addClass("hovered");
						if (settings.selectable && !dropdown.hasClass("multiple")) { setSelect(lfi, true); }
					}

					$(document).off("mousemove.2"+uniqueId).one("mousemove.2"+uniqueId, mouseMover);
				}
			});

			/* A function for select dropdown .item active and set the input value */
			function setSelect(sItem, xClose) {
				if (sItem) {
					if (dropdown.hasClass("multiple")) {
						if (sItem.hasClass("selected")) { return; }

						var sIValue = sInput.data("value") || [];
						
						sItem.addClass("selected");
						sIValue.push(sItem.data("value") || sItem.text());
						sInput.data("value", sIValue).val(sIValue);
						$("<div class='compact label'>"+sItem.html()+"<i class='close i-close icon'></i></div>").data("index", sItem.index()).appendTo(sContent);
						sItem.data("index",sIValue.length -1);
						directItems = dropdownMenu.find("> .item, > .items > .item").not(".xhover,.disabled,.filtered"+(!dropdown.is(".indicating.multiple") ? ",.selected":""));
						if (dropdown.hasClass("search")) {
							searchBox.val("").trigger("input").focus();
						}

						if (dropdown.hasClass("indicating")) { return; }
						
						sItem.removeClass("hovered");
						
						if (!dropdown.hasClass("search")) {
							if (sItem.nextAll().filter(".item").not(".xhover,.disabled,.selected,.filtered").first().length) { 
								sItem.nextAll().filter(".item").not(".xhover,.disabled,.selected,.filtered").first().addClass("hovered");
							}
							else if (sItem.prevAll().filter(".item").not(".xhover,.disabled,.selected,.filtered").first().length) {
								sItem.prevAll().filter(".item").not(".xhover,.disabled,.selected,.filtered").first().addClass("hovered");
							}
						}

						if (!dropdownMenu.find("> .item, > .items > .item").not("xhover,.disabled,.selected").length) {
							$("<div id='sm"+uniqueId+"' class='ed-msg'>All available items is selected.</div>").appendTo(dropdownMenu);
						}

						dropdownMenu.trigger("refresh");
					}
					else {
						sItem.addClass("active").siblings().removeClass("active");
						var sIValue = sItem.data("value") === undefined ? sItem.text() : sItem.data("value");
						sInput.val(sIValue);
						sContent.html(sItem.html());
					}
				}

				if (!xClose) { 
					if (!dropdown.hasClass("multiple") && directItems.filter(".hovered").length) { 
						setSelect(directItems.filter(".hovered").removeClass("hovered"));
						return;
					}

					dropdown.hideDropdown(settings);
				}
			}

			/* Function to run after deselecting an item */
			function setDeselect() {
				if (dropdownMenu.find("> .item, > .items > .item").not("xhover,.disabled,.selected").length && dropdownMenu.children(".ed-msg").length) {
					dropdownMenu.children(".ed-msg").remove();
				}

				if (dropdown.hasClass("search")) {
					searchBox.val("").trigger("input");
				}
				
				directItems = dropdownMenu.find("> .item, > .items > .item").not(".xhover,.disabled,.filtered"+(!dropdown.is(".indicating.multiple") ? ",.selected":""));
				dropdownMenu.trigger("refresh");
			}

			/* A mousemove function to trigger when mouse is moved and inititially you are on keyboard navigation mode. */
			function mouseMover(e) {
				var $target = $(e.target), $hovered = dropdownMenu.find("> .item.hovered, > .items > .item.hovered");

				if ($target.closest(dropdown).length || $target.closest(dropdownMenu).length) {
					$target.closest(directItems).addClass("hovered").siblings().removeClass("hovered");
				}
				else if (settings.hover) { dropdown.hideDropdown(settings); }
				else { directItems.removeClass("hovered"); }

				itemsHoverEvent();
			}

			/* Invoke a function to trigger the hover event on dropdown menu item. */
			function itemsHoverEvent() {
				var selector = dropdown.is(".select.multiple")
					? "> .item:not(.xhover):not(.disabled):not(.selected)"
					: "> .item:not(.xhover):not(.disabled)"
				;

				dropdownMenu.on("mouseenter."+uniqueId, selector+", > .items" +selector, function(e) {
					$(this).addClass("hovered").siblings().removeClass("hovered");
				});

				dropdownMenu.on("mouseleave."+uniqueId, selector+", > .items" +selector, function(e) {
					$(this).removeClass("hovered");
				});
			}

			itemsHoverEvent();
			
			/* dropdown positioning */
			$(window).on("resize." + uniqueId, function() {
				if (settings.page) {
					var cord = {
						original: settings.e,
						left: settings.e.pageX - $(window).scrollLeft(),
						top: settings.e.pageY - $(window).scrollTop()
					};


					cord.right = $(window).width() - cord.left;
					cord.bottom = $(window).height() - cord.top;
					dropdownMenu.css({"right": "auto", "bottom": "auto"});

					if (cord.right >= dropdownMenu.outerWidth()) {
						dropdownMenu.css("left", cord.left).addClass("rhs");
					}
					else if (cord.left >= dropdownMenu.outerWidth()) {
						dropdownMenu.css("left", cord.left - dropdownMenu.outerWidth()).addClass("lhs");
					}
					else if (cord.right >= cord.left) {
						dropdownMenu.addClass("rhs");
						if (cord.right + cord.left >= dropdownMenu.outerWidth()) {
							dropdownMenu.css("left", $(window).width() - dropdownMenu.outerWidth());
						}
						else {
							dropdownMenu.css({"left": 0, "max-width": $(window).width()});
						}
					}
					else {
						dropdownMenu.addClass("lhs");
						if (cord.right + cord.left >= dropdownMenu.outerWidth()) {
							dropdownMenu.css("left", 0);
						}
						else {
							dropdownMenu.css({"left": 0, "max-width": $(window).width()});
						}
					}

					if (cord.bottom >= dropdownMenu.outerHeight()) {
						dropdownMenu.css("top", cord.top).addClass("downward");
					}
					else if (cord.top >= dropdownMenu.outerHeight()) {
						dropdownMenu.css("top", cord.top - dropdownMenu.outerHeight()).addClass("upward");
					}
					else if (cord.bottom >= cord.top) {
						dropdownMenu.addClass("downward");
						if (cord.bottom + cord.top >= dropdownMenu.outerHeight()) {
							dropdownMenu.css("top", $(window).height() - dropdownMenu.outerHeight());
						}
						else {
							dropdownMenu.css({"top": 0, "max-height": $(window).height()});
						}
					}
					else {
						dropdownMenu.addClass("upward");
						if (cord.bottom + cord.top >= dropdownMenu.outerHeight()) {
							dropdownMenu.css("top", 0);
						}
						else {
							dropdownMenu.css({"top": 0, "max-height": $(window).height()});
						}
					}
				}
				else {
					dropdownMenu.removeClass("upward downward rhs lhs").css({"max-width": "", "min-width": ""});

					var
						getOP = dropdownMenu.parentsUntil("body").filter(function() {
							var ofv = $(this).css("overflow-y");
							return (ofv == "auto" || ofv == "scroll")
						}).first(),
						opChecker = getOP.length,
						op = opChecker ? getOP : $("html, body"),
						opProp = {
							height: opChecker ? getOP.innerHeight() : $(window).innerHeight(),
							width: opChecker ? getOP.innerWidth() : $(window).innerWidth(),
							top: opChecker ? getOP.offset().top : documentOffset().top,
							left: opChecker ? getOP.offset().left : documentOffset().left,
							tScroll: opChecker ? getOP.scrollTop() : $(document).scrollTop(),
							lScroll: opChecker ? getOP.scrollLeft() : $(document).scrollLeft()
						},
						dProp = {
							height: dropdown.outerHeight(),
							width: dropdown.outerWidth(),
							top: opChecker ? dropdown.offset().top - opProp.top + opProp.tScroll : dropdown.offset().top,
							left: opChecker ? dropdown.offset().left - opProp.left + opProp.lScroll : dropdown.offset().left,
							position: dropdown.position()
						},
						dmProp = {}, spacing = {}
					;

					if (settings.fluidMinWidth) {
						dropdownMenu.css("min-width", dropdownMenu.outerWidth());
					}

					if (settings.constrainWidth) {
						dropdownMenu.css({
							"max-width": dropdown.outerWidth(),
							"width": dropdown.outerWidth()
						});
					}

					dmProp.height = dropdownMenu.outerHeight(true);
					dmProp.width = dropdownMenu.outerWidth(true);

					if (settings.view == "horizontal") {
						spacing.top = dProp.top - opProp.tScroll + dProp.height;
						spacing.bottom = opProp.height - dProp.top + opProp.tScroll;
						spacing.left = dProp.left - opProp.lScroll;
						spacing.right = opProp.width - spacing.left - dProp.width;	
					}
					else {
						spacing.top = dProp.top - opProp.tScroll;
						spacing.bottom = opProp.height - spacing.top - dProp.height;
						spacing.left = dProp.left - opProp.lScroll + dProp.width;
						spacing.right = opProp.width - dProp.left + opProp.lScroll;
					}

					if (!dropdownMenu.hasClass("board")) {
						if (spacing.right >= dmProp.width || spacing.right >= spacing.left) {
							dropdownMenu.addClass("rhs");
						}
						else if (spacing.left >= dmProp.width) {
							dropdownMenu.addClass("lhs");
						}
					}

					spacing.top -=5;
					spacing.bottom -=5;

					if (spacing.bottom >= dmProp.height) {
						dropdownMenu.addClass("downward");
					}
					else if (spacing.top >= dmProp.height) {
						dropdownMenu.addClass("upward");
					}
					else if (spacing.top > spacing.bottom && spacing.top + opProp.tScroll > dProp.height + dmProp.height) {
						dropdownMenu.addClass("upward");
						setTimeout(function() {
							anime({
								targets: op[0],
								scrollTo: Math.max(dProp.top - dmProp.height - 10, dProp.top - opProp.height + dProp.height + 5),
								duration: 100,
								easing: "linear",
							});
						}, 100);
					}
					else {
						dropdownMenu.addClass("downward");
						setTimeout(function() {
							anime({
								targets: op[0],
								scrollTo: Math.min(dProp.top - opProp.height + dProp.height + dmProp.height + 10, dProp.top - 5),
								duration: 100,
								easing: "linear",
							});
						}, 100);
					}

					if (settings.browser) {
						dropdownMenu.css({
							"right": "auto",
							"bottom": "auto"
						});

						if (settings.view == "horizontal") {
							if (!dropdownMenu.hasClass("board")) {
								if (dropdownMenu.hasClass("rhs")) {
									dropdownMenu.css("left", dProp.position.left + dProp.width);
								}
								else {
									dropdownMenu.css("left", dProp.position.left - dmProp.width);
								}
							}

							if (dropdownMenu.hasClass("downward")) {
								dropdownMenu.css("top", dProp.position.top)
							}
							else {
								dropdownMenu.css("top", dProp.position.top - dmProp.height + dProp.height);
							}
						}
						else {
							if (!dropdownMenu.hasClass("board")) {
								if (dropdownMenu.hasClass("rhs")) {
									dropdownMenu.css("left", dProp.position.left)
								}
								else {
									dropdownMenu.css("left", dProp.position.left + dProp.width - dmProp.width);
								}
							}

							if (dropdownMenu.hasClass("downward")) {
								dropdownMenu.css("top", dProp.position.top + dProp.height);
							}
							else {
								dropdownMenu.css("top", dProp.position.top - dmProp.height);
							}
						}
					}
				}
			});

			dropdownMenu.addClass("visible animating");
			dropdownMenu.trigger("refresh", [keyboard ? false : true]);
			
			setTimeout(function() { dropdownMenu.removeClass("animating"); }, settings.duration);
		},

		hideDropdown: function(settings, closeAll) {
			if (!$(this).hasClass("active")) { return }

			var
				dropdown = $(this),
				dropdownMenu = (settings.browser) ? $(settings.menuId) : dropdown.children(".drop.menu, .drop-board"),
				items = dropdownMenu.find(".item").not(".xhover,.divider"),
				directItems = dropdownMenu.find("> .item, > .items > .item").not(".xhover,.divider"),
				uniqueId = dropdown.data("uniqueId")
			;

			$(window).off("resize." + uniqueId);
			$(document).off("keydown."+uniqueId+" keyup."+uniqueId+" click."+uniqueId+" mousemove.2"+uniqueId);
			dropdown.off("mouseleave."+uniqueId).removeClass("active");
			dropdownMenu.off("mouseenter."+uniqueId+" mouseleave."+uniqueId)
				.removeClass("visible").addClass("animating")
				.find(".dropdown").filter(".active").each(function() {
				$(this).hideDropdown($(this).data("settings"));
			});

			if (!directItems.filter(".active").length) { dropdownMenu.scrollTop(0); }

			if (dropdown.hasClass("search")) {
				dropdown.children("input.search").val("")
					.css("width", dropdown.children("span.sizer").text(dropdown.children("input.search").val()).innerWidth())
					.off("input."+uniqueId);
				dropdown.children(".content,.placeholder").removeClass("filtered");
			}
						
			setTimeout(function() {
				dropdownMenu.removeClass("upward downward rhs lhs animating");
				directItems.removeClass("hovered");
			}, settings.duration);

			if (closeAll) {
				var browsedC = dropdown.parents(".drop.menu, .drop-board").filter(function() {
					if ($(this).data("browsed")) { return $(this)}
				});

				if (browsedC.length) {
					browsedC.each(function() {
						var $this = $(this), menuTrigger;

						menuTrigger = $("[href='#" + $this.attr("id") + "']").filter(".dropdown").length
							? $("[href='#" + $this.attr("id") + "']").filter(".dropdown")
							: $("[data-target='" + $this.attr("id") + "']").filter(".dropdown");
						menuTrigger.hideDropdown(menuTrigger.data("settings"), true)
					})
				}

				dropdown.parents(".dropdown").each(function() {
					$(this).hideDropdown($(this).data("settings"), true);
				});
			}
		}
	});
})(jQuery, window, document);


/*!
* Layout-UI iScroll
* Copyright 2021 Folorunso David A.
*/
(function ($, window, document, undefined) {

	"use strict";

	window = (typeof window != "undefined" && window.Math == Math)
		? window
		: (typeof self != "undefined" && self.Math == Math)
			? self
			: Function('return this')()
	;

	$.fn.extend({
		iScroll: function(options) {
			$(this).each(function() {
				var
					$this = $(this),
					settings = $.extend({}, {
						pluginName: "iScroll",
						scrollBody: ".items",
						scrollContent: ".item",
						scrollLeftBtn: ".l-scroll",
						scrollRightBtn: ".r-scroll",
						tolerance: 28
					}, options),
					scrollElem = $this.find(settings.scrollBody),
					prevBtn = $this.find(settings.scrollLeftBtn),
					nextBtn = $this.find(settings.scrollRightBtn),
					items = $this.find(settings.scrollContent),
					prop = {
						scrollX: scrollElem.scrollLeft(),
						width: scrollElem.width()
					},
					startCoords, endCoords, clickCapture = false
				;

				settings.uniqueId = getUniqueId(settings.pluginName);

				prevBtn.on("click."+settings.uniqueId, function() {
					prop.width = scrollElem.width();
					prop.left = scrollElem.offset().left;
					prop.scrollX = scrollElem.scrollLeft();

					var checker = [];
					items.each(function() {
						if ($(this).offset().left + $(this).outerWidth() - prop.left < 0) { return; }
						else { checker.push(prop.scrollX - (prop.left + prop.width - $(this).offset().left - $(this).outerWidth())); }
					});

					if (checker.length) {
						prop.scrollExt = Math.min.apply(null, checker) + settings.tolerance;

						anime({
							targets: prop,
							scrollX: prop.scrollExt,
							duration: 200,
							easing: "linear",
							update: function() { scrollElem.scrollLeft(prop.scrollX) },
							complete: function() {
								prop.scrollX = scrollElem.scrollLeft();
								nextBtn.removeClass("disabled");

								if (prop.scrollX === 0) {
									prevBtn.addClass("disabled");
								}
								else {
									prevBtn.removeClass("disabled");
								}
							}
						});
					}
				});

				nextBtn.on("click."+settings.uniqueId, function() {
					prop.width = scrollElem.width();
					prop.left = scrollElem.offset().left;
					prop.scrollX = scrollElem.scrollLeft();
					
					var checker = [];

					items.each(function() {
						if ($(this).offset().left - prop.left < 0 || $(this).offset().left + $(this).outerWidth() < prop.left + prop.width) { return; }
						else { checker.push(prop.scrollX + $(this).offset().left - prop.left); }
					});

					if (checker.length) {
						prop.scrollExt = Math.min.apply(null, checker) - settings.tolerance;

						anime({
							targets: prop,
							scrollX: prop.scrollExt,
							duration: 200,
							easing: "linear",
							update: function() { scrollElem.scrollLeft(prop.scrollX) },
							complete: function() {
								prop.scrollX = scrollElem.scrollLeft();
								prevBtn.removeClass("disabled");

								if (prop.scrollX + prop.width >= scrollElem[0].scrollWidth) {
									nextBtn.addClass("disabled");
								}
								else {
									nextBtn.removeClass("disabled");
								}
							}
						});
					}
				});
				
				// Drag functionality
				$this.on("touchstart."+settings.uniqueId+" mousedown."+settings.uniqueId, gestureStart);

				function gestureStart(e, fallBack) {
					if (fallBack) { return }
					if ($(e.target).closest(scrollElem)) {
						e.preventDefault();
						clickCapture = e.target;
						startCoords = e.type.indexOf("touch") > -1 ? e.originalEvent.touches[0].clientX : e.clientX;
						if (e.type === "click") {
							return;
						}
						$(document).on("touchmove."+settings.uniqueId+" mousemove."+settings.uniqueId, gestureMove);
						$(document).on("touchend."+settings.uniqueId+" mouseup."+settings.uniqueId, gestureEnd);
					}
				};

				function gestureMove(e) {
					endCoords = e.type.indexOf("touch") > -1 ? e.originalEvent.touches[0].clientX : e.clientX;
					if (Math.abs(endCoords - startCoords) > 5) {
						clickCapture = false;
						scrollElem.scrollLeft(prop.scrollX - (endCoords - startCoords));
					}
				}

				function gestureEnd(e) {
					e.preventDefault();
					$(document).off("touchmove."+settings.uniqueId+" mousemove."+settings.uniqueId+" touchend."+settings.uniqueId+" mouseup."+settings.uniqueId);
					prop.scrollX = scrollElem.scrollLeft();

					// Trigger click event handler
					if (clickCapture !== false) {
						$(clickCapture).trigger("click", [true]);
						$(clickCapture).trigger("iSclick", [e]); // use this handler to escape trigger of click on mouseup
					}

					if (prop.scrollX === 0) {
						prevBtn.addClass("disabled");
						nextBtn.removeClass("disabled");
					}
					else if (prop.scrollX + prop.width >= scrollElem[0].scrollWidth) {
						nextBtn.addClass("disabled");
						prevBtn.removeClass("disabled");
					}
					else {
						prevBtn.add(nextBtn).removeClass("disabled");
					}

					clickCapture = false;
				}
				
				$this.on("wheel."+settings.uniqueId, function(e) {
					e.preventDefault();

					if (e.originalEvent.deltaY > 0) {
						scrollElem.scrollLeft(prop.scrollX + 30)
						prop.scrollX = scrollElem.scrollLeft();
					}
					else {
						scrollElem.scrollLeft(prop.scrollX - 30)
						prop.scrollX = scrollElem.scrollLeft();
					}

					if (prop.scrollX === 0) { prevBtn.addClass("disabled"); }
					else { prevBtn.removeClass("disabled"); }

					if (prop.scrollX + prop.width >= scrollElem[0].scrollWidth) { nextBtn.addClass("disabled"); }
					else { nextBtn.removeClass("disabled"); }
				});

				$this.on("activeView."+settings.uniqueId, function(e, ae) {
					prop.width = scrollElem.width();
					prop.left = scrollElem.offset().left;
					prop.scrollX = scrollElem.scrollLeft();

					var aeProp = {
						left: ae.offset().left,
						width: ae.outerWidth()
					}

					prop.scrollExt = prop.scrollX - ((prop.width/2) - aeProp.left + prop.left - (aeProp.width/2));

					anime({
						targets: prop,
						scrollX: prop.scrollExt,
						duration: 200,
						easing: "easeInSine",
						update: function() { scrollElem.scrollLeft(prop.scrollX) },
						complete: function() {
							prop.scrollX = scrollElem.scrollLeft();

							if (prop.scrollX === 0) { prevBtn.addClass("disabled"); }
							else { prevBtn.removeClass("disabled"); }

							if (prop.scrollX + prop.width >= scrollElem[0].scrollWidth) { nextBtn.addClass("disabled"); }
							else { nextBtn.removeClass("disabled"); }
						}
					});
				});

				$this.data("iScroll-settings", settings);
			});
		},

		offIscroll: function() {
			$(this).each(function() {
				if ($(this).data("iScroll-settings") === undefined) {
					return;
				}

				var 
					$this = $(this),
					settings = $this.data("iScroll-settings"),
					prevBtn = $this.find(settings.scrollLeftBtn),
					nextBtn = $this.find(settings.scrollRightBtn)
				;

				$this.off("touchstart."+settings.uniqueId+" mousedown."+settings.uniqueId+" wheel."+settings.uniqueId+" activeView."+settings.uniqueId);
				prevBtn.off("click."+settings.uniqueId);
				nextBtn.off("click."+settings.uniqueId);
				$this.data("iScroll-settings", undefined);
			});
		}
	});
	
	$(document).ready(function() {
		$(".scroll-items").iScroll();
	});
})(jQuery, window, document);

/*!
* Layout UI Modal and Lightbox
* Copyright 2016-2022 Folorunso David A.
*/

(function($, window, document, undefined) {

	"use strict";

	window = (typeof window != "undefined" && window.Math == Math)
		? window
		: (typeof self != "undefined" && self.Math == Math)
			? self
			: Function('return this')()
	;

	$.fn.extend({
		modal: function(options) {
			options = options || {};

			this.each(function() {
				var
					modaler = $(this),
					modal = $(modaler.attr("href") || "#" + $(this).data("target"))
				;

				modaler.click(function() {
					options.initiator = modaler;
					modal.openModal(options);
				});
			});
		},

		lightbox: function(options) {
			this.each(function() {	
				$(this).on("click", function(e) {
					e.preventDefault();
					$(this).lightboxInit();
				});
			});
		},

		lightboxInit: function(options) {
			if (!$(this).data("lbInitialized")) {
				var 
					$this = $(this),
					contentChecker = {
						youtube : /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/,
						image : /\.(jpg|jpeg|png|webp|avif|gif|svg)$/,
						video: /\.(mp4|Webm|ogg)$/
					},
					url = $this.attr("href"),
					content = "#" === url.charAt(0)
								? {html: $(url).clone().removeAttr("class style id").outerHTML, type: "html"}
								: contentChecker.image.test(url)
									? {html: "<img src='"+url+"' />", type: "image"}
									: contentChecker.video.test(url)
										? {html: "<video controls><source src='"+url+"' /></video>", type: "video"}
										: contentChecker.youtube.test(url)
											? {html: "<iframe src='https://www.youtube.com/embed/"+url.match(contentChecker.youtube)+"?autoplay=1&enablejsapi=1' allowfullscreen></iframe>", type: "youtube"}
											: {html: "", type: ""}
				;

				$this.data({
					lbContent: "<div class='content' data-cont-type ='"+content.type+"'>"+content.html+"</div>",
					lbType: content.type,
					lbCaption: "<div class='caption'>"+($this.data("caption-head") ? "<div class='sub heading'>"+$this.data("caption-head")+"</div>":"")+($this.data("caption") ? "<p>"+$this.data("caption")+"</p>":"")+"</div>",
					lbInitialized: true
				});
			}

			if (options === "preload") { return }
			$(this).manifestLightbox();
		},

		manifestLightbox: function(options) {
			var 
				node = $(this),
				settings = $.extend(settings, {
					nameSpace: "lightbox",
					iaTimeout: 6000, // inactive timeout
					slideshow: true,
					slideshowDuration: 6000,
					thumbnailsView: true,
					closeOnWrapperClick: false
				}, $.isPlainObject(options) ? options : {}),
				allSlides = "",
				thumbnails = "",
				nodes, lightbox, toolbar, slider, gallery,
				currSlide, prevSlide, nextSlide,
				currContent, currPic, uniqueId,
				bb = { //brainbox
					startCoords: {x: 0, y: 0, h: 0, zoom: 1},
					endCoords: {x: 0, y: 0, h: 0, zoom: 1},
					newCoords: {x: 0, y: 0, h: 0, zoom: 1, change: false},
					doubleTap: 0
				}
			;

			if (node.data("lightbox").length) {
				settings.gallery = true;
				nodes = $("a[data-lightbox='"+node.data("lightbox")+"']");
				settings.slidesNo = nodes.length;
				settings.slideNo = nodes.index(node)+1;
				for (var i = 1; i < settings.slidesNo+1; i++) {
					allSlides = allSlides + "<div class='slide"+(settings.slideNo === i ? " active" : "")+"' data-galleryNo='"+i+"'>"+
						(settings.slideNo === i
							? node.data("lbContent") + node.data("lbCaption") 
							: "")+
					"</div>";

					if (settings.thumbnailsView && settings.slidesNo > 1) {
						thumbnails = thumbnails + "<div class='thumbnail"+(settings.slideNo === i ? " active" : "")+"' data-galleryNo = '"+i+"'>"+
							(settings.slideNo === i
								? "<img src='"+(node.data("thumb") ? node.data("thumb") : node.data("lbType") === "image" ? node.attr("href") : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAjVBMVEX/////AAD/eXn/rKz/3Nz/pKT/1tb/4+P/7e3/39//FBT/6ur/qKj/+vr/np7/5+f/cXH/YGD/y8v/trb/8vL/vr7/sbH/Kir/w8P/gID/VFT/ICD/hYX/W1v/RUX/Zmb/l5f/ZGT/ODj/TEz/kZH/UVH/MjL/Pj7/Jib/n5//z8//b2//i4v/DQ3/NTWFyUkzAAAEfklEQVR4nO3c63LaMBAFYAG2MQ42N0PM3VySEEr6/o9XIA4N4Gky7NlISc/3t52OTwFLWklrDBERERERERERERERERERERERERERERERERFR6gUH2cBPJol/kAyr14o/Oxhk+7/fsv3cJeI0bNUbXpD5u/a005ndVwCiKLqfzYf5c+Jngdeot1I74e66tWYynI+WY0SqfxgvF+tmrZd58Remi5vt6WyjnOzcy3j50E68r4kXdL4027n8Tj1gWLWYb+8xV/62eiO7Afc6qt/Vnu14Rz29gH3b2QqZVsCu9sjwWeOtTkAvsp3s5L6uknBqO9c7vzQCuvGWedPFB7x7sh3qzAo/LDZtZ7oAHzLShe1IF4boD9GznehShH6dDmwnuoJ+18xtB7oyASe0nefa5scnrGADBrbjlMAuhn3bcUoMoAkntuOUWEMTuvcqrVTa0IQurSvedJABWzPbcUo8IEvFwaPtOCWeGsCEmSv1i/c2yHmbW6vfQtQHJqzZTlMKOSBKlr9NH7IlVaIGTJiIniMYwkKdaeICxjvBc9QOuzkqb6oEmFCyHfP6XeqtYMFOdrhChqhIU/xawjX8c6ziEoaSHafT+8BDT27nuElNS1IrfffG22L35qYhLqFk0vb+nZ72kCPHCrcGrkt+QuejVl3yWr7whDuf0ngRPMfluBxOUXtY98CEkue4nnn0QavNMa4oDE5oUkzZB1j2FpX0S2eP8Q4xOuIWiPiExnTbPz2hibsOJdxqJNzzhbuuuJM1mVJCU59IxiFgQtE5mn+vU7eSNQcuoahM89FKXLCuwiUUlWk+rDWEzVsnObiEolMKn6imeDeOHLiEoinIp+pF3uiWGQAuoWgT/3MVsfjhhn8ad7xN8V1aaNz0GeLOKGonvPV3iCvrq434R7e/S3HfUtEM8luMh4oJHZnTiE5ifIt5qcrqybi0tnB1feh2wp++xnetTvPza22O1ks3uIR1N2vev3E1b0f3LWa4nRlH955GwN01N/cPF7gd0vCW5ekbvT1g4C53KrkYWyS8w+/jT4AJJfOP4iyGwunGHBbQxJIjwsfzNCo3v4EnhkwueA69M1HIU1+SWZb/rHWuDXlyz8mzidDTl+7deqqAT9D23bkC/NcSeTF/q/VTklghT7I33Loi+2oKDGhSybRNyxyZ0CxsxymBvYBouaNJKeSUxpi17TglsK0jRHszSqABTWo7TglsQgdvya7ACe33FrqUgxO6N/dG96hxrqfCC7qnQuraPVlgGargWm8T7E3uA8f608xw1eATt25Z4j9C49Z9bujK6SRwZ6G/Ueq713Ulola/tv+g554rNTfFvon736L9141u70tj4txu2e23dv9Sc9gmsxgw0e9Be+Ttpiv1FskXosdRG1nG/1DoZbVk+Eu/F/ShG3Qnbw76wVfGe1P0897rDvLqotMZLaMIMGhG0fhpWl0nid+z2dH7A6G3/28PiubspT3ZXw3zY1f2WvGXdRqTEhEREREREREREREREREREREREREREREREdF38gcDoWHX3NyCJAAAAABJRU5ErkJggg==")+"' />"
								: "")+
						"</div>";
					}
				};
			} else {
				allSlides = "<div class='slide active'>"+node.data("lbContent") + node.data("lbCaption")+"</div>"
			}

			uniqueId = settings.gallery ? "gallery-"+node.data("lightbox") : getUniqueId(settings.namespace);
			settings.uniqueId = uniqueId;
			settings.initiator = node;

			$("body").append($("<div class='lightbox modal' id='"+settings.uniqueId+"'>"+
				"<div class='progress-bar'><div class='determinate'></div></div>"+
				"<div class='icon-bar md-control inverted menu'>"+
					"<div class='xhover status item'></div>"+
					"<div class='r-aligned items'>"+
						"<div class='dropdown items' data-options='closeOnItemClick:false;'>"+
							"<a class='item sm-and-up-hidden' title='More options'><i class='icon i-dots-vertical'></i></a>"+
							"<div class='drop-board sm-stackable items'>"+
								(settings.thumbnailsView && settings.slidesNo > 1 ? "<a class='item gallery-switch dd-close' title='Show all slides'><i class='icon i-apps'></i> <span class='sm-and-up-hidden'>Show All</span></a>":"")+
								(settings.slideshow ? "<a class='"+(settings.slidesNo > 1 ? "" : "disabled ")+ "item slideshow dd-close'><i class='nview i-play-circle-outline icon' title='Start slideshow'></i><i class='aview i-pause-circle-outline icon' title='Stop slideshow'></i> <span class='sm-and-up-hidden'>Slideshow</span></a>":"")+
								"<a class='item fullscreen-switch dd-close' title='Toggle fullscreen'><i class='nview i-fullscreen icon'></i><i class='aview i-fullscreen-exit icon'></i> <span class='sm-and-up-hidden'>Toggle Fullscreen</span></a>"+
								"<a class='item zoom-in' title='Zoom in'><i class='i-magnify-plus-outline icon'></i> <span class='sm-and-up-hidden'>Zoom-In</span></a>"+
								"<a class='disabled item zoom-out' title='Zoom out'><i class='i-magnify-minus-outline icon'></i> <span class='sm-and-up-hidden'>Zoom-Out</span></a>"+
							"</div>"+
						"</div>"+
						"<a class='pic-only item' title='Picture only view'><i class='icon i-image'></i></a>"+
						"<a class='item exit-modal' title='Exit lightbox'><i class='i-window-close icon'></i></a>"+
					"</div>"+
				"</div>"+
				(settings.gallery && settings.slidesNo > 1
					? "<div class='md-control c-prev"+(settings.slideNo === 1 ? " disabled" : "")+"'><i class='icon i-chevron-left'></i></div>"+
						"<div class='md-control c-next"+(settings.slideNo === settings.slidesNo ? " disabled" : "")+"'><i class='icon i-chevron-right'></i></div>"
					: ""
				)+
				"<div class='modal-dialog slides'"+(settings.gallery ? " data-slidesNo='"+settings.slidesNo+"'" : "")+">"+
					allSlides +
				"</div>"+
				(settings.thumbnailsView && settings.slidesNo > 1
					? "<div class='md-control gallery-view b-fixed'>"+
							"<div class='l-scroll'><i class='icon i-chevron-double-left'></i></div>"+
							"<div data-thumbnails>"+
								thumbnails+
							"</div>"+
							"<div class='r-scroll'><i class='icon i-chevron-double-right'></i></div>"+
						"</div>"
					: ""
				)+
			"</div>"));

			lightbox = $("#"+settings.uniqueId);
			slider = lightbox.children(".slides");
			toolbar = lightbox.children(".icon-bar");
			allSlides = slider.children(".slide");
			
			if (settings.thumbnailsView && settings.slidesNo > 1) {
				gallery = lightbox.find(".gallery-view");
				thumbnails = gallery.find(".thumbnail");
							
				gallery.iScroll({
					scrollBody: "[data-thumbnails]",
					scrollContent: ".thumbnail",
					scrollLeftBtn: ".l-scroll",
					scrollRightBtn: ".r-scroll",
					tolerance: 0
				});

				// Gallery-view controls
				gallery.on("iSclick."+uniqueId, function(e, ev) {
					var $target = $(ev.target);
					if ($target.closest(".thumbnail").length) {
						var newI = $target.closest(".thumbnail").data("galleryno");

						update(newI === settings.slideNo ? 0 : newI > settings.slideNo ? 1 : -1, true, newI), stopSlideshow();
					}
				});
			}

			if (settings.slidesNo > 1) {
				// Next and previous button control
				var
					prevBtn = lightbox.find(".c-prev").off("click").on("click", function(e){
						update(-1);
						stopSlideshow();
					}),
					nextBtn = lightbox.find(".c-next").off("click").on("click", function(e){ 
						update(1);
						if (settings.playing) {
							stopSlideshow();
							startSlideshow();
						}
					})
				;
			}
			
			// Hide lightbox controls if no pointer event triggered for some period of time.
			$(document).on("mousemove.a"+uniqueId+" click.a"+uniqueId, function() {
				lightbox.removeClass("hide-controls");
				clearTimeout(settings.ctrlsHider);
				settings.ctrlsHider = setTimeout(function() {
					lightbox.addClass("hide-controls");
				}, settings.iaTimeout);
			});

			// Caption is truncated to contain a line. Click on it to show full text and click out for otherwise.
			$(document).on("click.b"+uniqueId, function(e, fallBack) {
				if ($(fallBack).closest(allSlides.find(".caption")).length) { return; }
				// Add .full-text class to caption when clicked
				if ($(e.target).closest(".caption").length) {
					currSlide.find(".caption").toggleClass("full-text");
				}
				// Remove .full-text from caption when there's click-out
				else {
					currSlide.find(".caption").removeClass("full-text");
				}
			});

			toolbar.on("click."+uniqueId, function(e) {
				var $target = $(e.target);

				// Zoom-in and zoom-out funtionality on toolbar
				if ($target.closest(".zoom-in").length) {
					bb.newCoords.zoom = bb.newCoords.zoom + .5;
					reAdjustSlide(); stopSlideshow();
					currContent.css("transform", "translate("+bb.newCoords.x+"px,"+bb.newCoords.y+"px) scale("+bb.newCoords.zoom+")");
					toolbar.find(".zoom-out").removeClass("disabled");	
				}
				else if ($target.closest(".zoom-out").length) {
					bb.newCoords.zoom = (bb.newCoords.zoom - .5 < 1) ? 1 : bb.newCoords.zoom - .5;
					reAdjustSlide(); stopSlideshow();

					if (bb.newCoords.zoom === 1) {
						bb.newCoords.x = 0;
						bb.newCoords.y = 0;
						currContent.removeAttr("style");
						toolbar.find(".zoom-out").addClass("disabled");
					}
					else {
						currContent.css("transform", "translate("+bb.newCoords.x+"px,"+bb.newCoords.y+"px) scale("+bb.newCoords.zoom+")");
					}
				}
				// Pic-only Funtionality
				else if ($target.closest(".pic-only").length) {
					toolbar.find(".pic-only").toggleClass("active");
					lightbox.toggleClass("pic-only");
				}
				// Gallery-view toggler
				else if ($target.closest(".gallery-switch").length) {
					toolbar.find(".gallery-switch").toggleClass("active");
					lightbox.toggleClass("show-gallery");
					if (lightbox.hasClass("show-gallery")) {
						// delay set activeView of gallery to get accurate values
						setTimeout(function() {
							gallery.trigger("activeView", [thumbnails.eq(settings.slideNo-1)]);
						}, 100);
					}
				}
				// Slideshow start and pause control
				else if ($target.closest(".slideshow").length && settings.slideshow) {
					if (settings.playing) { stopSlideshow(); }
					else { startSlideshow(); }
				}
				// Fullscreen functionality
				else if ($target.closest(".fullscreen-switch").length) {
					if (document.fullscreenElement) {
						document.exitFullscreen();
					}
					else {
						lightbox[0].requestFullscreen();
						toolbar.find(".fullscreen-switch").addClass("active");
					}
				}
			});

			// Remove the active class from fullscreen-switch when fullscreen is off
			$(document).on("fullscreenchange."+uniqueId, function() {
				if (!document.fullscreenElement) {
					toolbar.find(".fullscreen-switch").removeClass("active");
				}
			});

			// Trigger responsiveness
			$(window).on("resize."+uniqueId, function(){
				reAdjustSlide();
				bb.newCoords.w = slider.outerWidth();
				currContent.css("transform", "translate("+bb.newCoords.x+"px, " + bb.newCoords.y+"px) scale("+bb.newCoords.zoom+")");
				
				if (lightbox.hasClass("show-gallery")) {
					gallery.trigger("activeView", [gallery.find(".thumbnail").removeClass("active").eq(settings.slideNo-1).addClass("active")]);
				}
			});

			update(0); // Trigger update(0) to make all slides intact

			// Gesture on Lightbox
			lightbox.on("touchstart."+uniqueId+" mousedown."+uniqueId, gestureStart);
			
			function update(dir, isRandom, newI, refresh) {
				if (dir === "refresh") { dir = 0; refresh = true; }

				var
					currI = settings.slideNo - 1, // 0-based index of current slide
					// Get new slide 0-based index form user update
					newI = dir === 0 // 0: No change made to slide
						? currI
						: isRandom // User update is from gallery-view
							? newI - 1
							: dir === 1 // User update to next slide
								? currI === settings.slidesNo - 1 
									? 0
									: currI + 1
								: currI === 0 // User update to previous slide
									? settings.slidesNo - 1 
									: currI - 1
				;

				if (dir !== 0) {
					allSlides.removeClass("active prev-slide next-slide");
				
					if (dir === -1) { currSlide.addClass("next-slide"); }
					else if (dir === 1) { currSlide.addClass("prev-slide"); }

					if (currContent.data("cont-type") === "video" && !refresh) {
						currPic[0].pause();
					}

					if (newI === 0) {
						prevBtn.addClass("disabled");
						nextBtn.removeClass("disabled");
					}
					else if (newI === settings.slidesNo - 1) {
						nextBtn.addClass("disabled");
						prevBtn.removeClass("disabled");
					}
					else {
						prevBtn.removeClass("disabled");
						nextBtn.removeClass("disabled");
					}
				}

				settings.slideNo = newI + 1;
				currSlide = allSlides.eq(newI).addClass("active");
				prevSlide = currSlide.prev(".slide").addClass("prev-slide");
				nextSlide = currSlide.next(".slide").addClass("next-slide");
				currContent = currSlide.find(".content");
				currPic = currContent.children();
				allSlides.removeAttr("style").find(".content").removeAttr("style");
				bb.newCoords = {x: 0, y: 0, h: 0, zoom: 1, change: false};
				toolbar.find(".zoom-out").addClass("disabled");

				if (currContent.data("cont-type") === "video" && !refresh) {
					currPic[0].play();
				}
				
				// Remove full-text class from all slides caption
				// ** delay 50ms to still work even if caption click is trigger when slide is swiped.
				if (!dir == 0) {
					setTimeout(function() {
						allSlides.find(".caption").removeClass("full-text");
					}, 50);
				}

				if (settings.gallery) {
					toolbar.children(".item.status").text(settings.slideNo+"/"+settings.slidesNo);
					if (!settings.thumbnailsView || settings.slidesNo < 2) { return; }
					gallery.trigger("activeView", [gallery.find(".thumbnail").removeClass("active").eq(settings.slideNo-1).addClass("active")]);
				}
			}

			function startSlideshow() {
				settings.slidePlayer = setInterval(function() {
					update(1);
					lightbox.find(".progress-bar > .determinate").removeAttr("style")
					setTimeout(function() {
						lightbox.find(".progress-bar > .determinate").css({width: "100%", transition: "width "+(settings.slideshowDuration-200)+"ms ease 0s"});
					}, 200);
				}, settings.slideshowDuration);

				if (!settings.playing) {
					setTimeout(function() {
						lightbox.find(".progress-bar > .determinate").css({width: "100%", transition: "width "+(settings.slideshowDuration-200)+"ms ease 0s"});
					}, 200);
				}

				settings.playing = true;
				toolbar.find(".slideshow").addClass("active");
				lightbox.addClass("playing");
			}

			function stopSlideshow() {
				settings.playing = false;
				clearInterval(settings.slidePlayer);
				lightbox.removeClass("playing").find(".progress-bar > .determinate").removeAttr("style");
				toolbar.find(".slideshow").removeClass("active");
			}

			function reAdjustSlide() {
				if (bb.newCoords.zoom > 1) {
					bb.xMax = Math.abs(((currPic.width() * bb.newCoords.zoom) - slider.width())/2) | 0;
					bb.yMax = Math.abs(((currPic.height() * bb.newCoords.zoom) - slider.height())/2) | 0;
					bb.newCoords.x = (Math.abs(bb.newCoords.x) > bb.xMax) ? Math.sign(bb.newCoords.x) * bb.xMax : bb.newCoords.x
					bb.newCoords.y = (Math.abs(bb.newCoords.y) > bb.yMax) ? Math.sign(bb.newCoords.y) * bb.yMax : bb.newCoords.y
				}
			}

			function dist(e, rq) {
				if (rq === 1) {
					return {
						x: (e.originalEvent.touches[0].pageX + e.originalEvent.touches[1].pageX) / 2,
						y: (e.originalEvent.touches[0].pageY + e.originalEvent.touches[1].pageY) / 2,
						h: Math.hypot(Math.abs(e.originalEvent.touches[0].pageX - e.originalEvent.touches[1].pageX),
							Math.abs(e.originalEvent.touches[0].clientY - e.originalEvent.touches[1].pageY))
					};
				}
				else {
					return {
						x: e.type.indexOf("touch") > -1 ? e.originalEvent.touches[0].clientX : e.clientX,
						y: e.type.indexOf("touch") > -1 ? e.originalEvent.touches[0].clientY : e.clientY
					};
				}
			}

			function gestureStart(e, fallBack) {
				if ($(e.target).closest(currContent).length || $(e.target).closest(currSlide.find(".caption:not(.full-text)")).length) {
					if (fallBack) { return }
					// e.preventDefault();
					
					// capture the event target to re-trigger the called event on it later since the default event action is prevented here.
					bb.gestureStore = {elem: e.target, type: e.type};
					
					if (settings.playing) {
						stopSlideshow();
						settings.playing = true;
					}

					// DoubleTab Function Triggerer
					bb.gestureTime = new Date().getTime();
					bb.tapLength = bb.gestureTime - bb.doubleTap;

					if ((bb.tapLength > 0 && bb.tapLength < 500) && !(e.type === "touchstart" && e.originalEvent.touches.length > 1)) {
						if (bb.newCoords.zoom === 1) {
							bb.pointerCoords = dist(e)
							bb.newCoords.zoom = 2;
							bb.newCoords.x = ($(window).width()/2) - bb.pointerCoords.x;
							bb.newCoords.y = ($(window).height()/2) - bb.pointerCoords.y;
							reAdjustSlide();
							currContent.css("transform", "translate("+bb.newCoords.x+"px, " + bb.newCoords.y+"px) scale("+bb.newCoords.zoom+")");
							toolbar.find(".zoom-out").removeClass("disabled");
						}
						else {
							bb.newCoords.x = 0, bb.newCoords.y = 0, bb.newCoords.zoom = 1;
							currContent.removeAttr("style");
							toolbar.find(".zoom-out").addClass("disabled");
						}
					
						bb.doubleTap = 0;
						return;	
					}

					bb.doubleTap = bb.gestureTime;
					// save the initial value of bb.newCoords to have it accessable when the move-gesture event is triggered. (That's because the bb.newCoords value might change during the event)
					bb.initCoords = {
						x: bb.newCoords.x,
						y: bb.newCoords.y,
						zoom: bb.newCoords.zoom
					}; 
					//Zooming with pinch
					if (e.type === "touchstart" && e.originalEvent.touches.length === 2) {
						e.preventDefault();
						currContent.addClass("zooming");
						bb.startCoords = dist(e, 1);
					}
					else {
						bb.startCoords = dist(e);
						// Swiping
						if (bb.newCoords.zoom === 1) {
							if (!settings.gallery) { return; }
							bb.newCoords.w = slider.outerWidth();
							slider.addClass("swiping");
						}
						//Zoom dragging
						else { currContent.addClass("zoom-dragging"); }
					}

					$(document).on("touchmove."+uniqueId+" mousemove."+uniqueId, gestureMove);
					$(document).on("touchend."+uniqueId+" mouseup."+uniqueId, gestureEnd);
				}
			}

			function gestureMove(e) {
				e.preventDefault();
				bb.endCoords = dist(e);

				// Pinch Zooming in action
				if (e.type === "touchmove" && e.originalEvent.touches.length === 2 && currContent.hasClass("zooming")) {
					bb.doubleTap = 0; // stop double-tap initialization
					bb.endCoords = dist(e, 1);
					bb.newCoords.zoom = (e.originalEvent.scale)
						? e.originalEvent.scale * bb.initCoords.zoom
						: bb.endCoords.h / bb.startCoords.h * bb.initCoords.zoom
					;
					bb.newCoords.x = bb.initCoords.x + (bb.endCoords.x - bb.startCoords.x);
					bb.newCoords.y = bb.initCoords.y + (bb.endCoords.y - bb.startCoords.y);
					bb.newCoords.change = true;
					currContent.css("transform", "translate("+bb.newCoords.x+"px,"+bb.newCoords.y+"px) scale("+bb.newCoords.zoom+")");
				}
				else if ((currContent.hasClass("zoom-dragging") || slider.hasClass("swiping")) &&
					(Math.abs(bb.endCoords.x - bb.startCoords.x) > 5 || Math.abs(bb.endCoords.y - bb.startCoords.y) > 5)) {
					bb.doubleTap = 0; // stop double-tap initialization
					bb.newCoords.x = bb.initCoords.x + bb.endCoords.x - bb.startCoords.x;
					bb.newCoords.y = bb.initCoords.y + bb.endCoords.y - bb.startCoords.y;
					bb.newCoords.change = true;

					// Swipping in action
					if (bb.newCoords.zoom === 1) {
						currSlide.css("transform", "translate("+bb.newCoords.x+"px, 0px)");
						if (bb.newCoords.x > 0) {
							prevSlide.css("transform", "translate("+(bb.newCoords.x - bb.newCoords.w)+"px, 0px)");
						}
						else {
							nextSlide.css("transform", "translate("+(bb.newCoords.x + bb.newCoords.w)+"px, 0px)");
						}
					}
					// Zoom-dragging in action
					else {
						currContent.css("transform", "translate("+bb.newCoords.x+"px, " + bb.newCoords.y+"px) scale("+bb.newCoords.zoom+")");
					}
				}
			}

			function gestureEnd(e) {
				$(document).off("touchmove."+uniqueId+" mousemove."+uniqueId+" touchend."+uniqueId+" mouseup."+uniqueId);

				if (currContent.hasClass("zooming")) {
					currContent.removeClass("zooming"), stopSlideshow();
					
					if (bb.newCoords.change) {
						if (bb.newCoords.zoom <= 1) {
							bb.newCoords.x = 0, bb.newCoords.y = 0, bb.newCoords.zoom = 1;
							currContent.removeAttr("style");
							toolbar.find(".zoom-out").addClass("disabled");
						}
						else {
							toolbar.find(".zoom-out").removeClass("disabled");
							reAdjustSlide();
							currContent.css("transform", "translate("+bb.newCoords.x+"px,"+bb.newCoords.y+"px) scale("+bb.newCoords.zoom+")");
						}
					}
				}
				else if (slider.hasClass("swiping")) {
					slider.removeClass("swiping");

					if (bb.newCoords.change) {
						if (bb.newCoords.x < 0) {
							currSlide.css("transform", "translate(-100%, 0px)");
							update(settings.slideNo === settings.slidesNo ? 0 : 1);
							
							if (settings.playing) {
								stopSlideshow();
								startSlideshow();
							}
						}
						else if (bb.newCoords.x > 0) {
							currSlide.css("transform", "translate(100%, 0px)");
							update(settings.slideNo === 1 ? 0 : -1);
							stopSlideshow();
						}
					}
					else {
						update("refresh"), stopSlideshow();
					}
				}
				else if (currContent.hasClass("zoom-dragging")) {
					currContent.removeClass("zoom-dragging");

					if (bb.newCoords.change) {
						reAdjustSlide();
						currContent.css("transform", "translate("+bb.newCoords.x+"px, " + bb.newCoords.y+"px) scale("+bb.newCoords.zoom+")");
					}
				}

				bb.newCoords.change = false;
				// trigger default click action on target element.
				if (bb.gestureStore.elem !== false) {
					$(bb.gestureStore.elem).trigger(bb.gestureStore.type, [e.type === "touchend" ? false : bb.gestureStore.elem])
				}
			}

			settings.ready = function(settings, lightbox) {
				if (lightbox.hasClass("show-gallery")) {
					var gallery = lightbox.find(".gallery-view");
					gallery.trigger("activeView", [gallery.find(".thumbnail").eq(settings.slideNo-1).addClass("active")]);
				}
			}

			settings.complete = function(settings, lightbox) {
				var uniqueId = settings.uniqueId;

				if (document.fullscreenElement) {
					document.exitFullscreen();
				}
				$(document).off("fullscreenchange."+uniqueId+" mousemove.a"+uniqueId+" click.a"+uniqueId+" click.b"+uniqueId);
				$(window).off("resize."+uniqueId);
				lightbox.remove();
			}

			settings.initiator = node;
			lightbox.openModal(settings);

			// Start preloading all other slide(s) in the lightbox
			if (settings.gallery) {
				nodes.not(node).each(function() {
					var
						node = $(this),
						slide = allSlides.eq(nodes.index(node))
					;

					node.lightboxInit("preload");
					slide.prepend(node.data("lbContent") + node.data("lbCaption"));

					if (settings.thumbnailsView && settings.slidesNo > 0) {
						var thumbnail = thumbnails.eq(nodes.index(node));
						thumbnail.prepend("<img src='"+(node.data("thumb") ? node.data("thumb") : node.data("lbType") === "image" ? node.attr("href") : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAjVBMVEX/////AAD/eXn/rKz/3Nz/pKT/1tb/4+P/7e3/39//FBT/6ur/qKj/+vr/np7/5+f/cXH/YGD/y8v/trb/8vL/vr7/sbH/Kir/w8P/gID/VFT/ICD/hYX/W1v/RUX/Zmb/l5f/ZGT/ODj/TEz/kZH/UVH/MjL/Pj7/Jib/n5//z8//b2//i4v/DQ3/NTWFyUkzAAAEfklEQVR4nO3c63LaMBAFYAG2MQ42N0PM3VySEEr6/o9XIA4N4Gky7NlISc/3t52OTwFLWklrDBERERERERERERERERERERERERERERERERFR6gUH2cBPJol/kAyr14o/Oxhk+7/fsv3cJeI0bNUbXpD5u/a005ndVwCiKLqfzYf5c+Jngdeot1I74e66tWYynI+WY0SqfxgvF+tmrZd58Remi5vt6WyjnOzcy3j50E68r4kXdL4027n8Tj1gWLWYb+8xV/62eiO7Afc6qt/Vnu14Rz29gH3b2QqZVsCu9sjwWeOtTkAvsp3s5L6uknBqO9c7vzQCuvGWedPFB7x7sh3qzAo/LDZtZ7oAHzLShe1IF4boD9GznehShH6dDmwnuoJ+18xtB7oyASe0nefa5scnrGADBrbjlMAuhn3bcUoMoAkntuOUWEMTuvcqrVTa0IQurSvedJABWzPbcUo8IEvFwaPtOCWeGsCEmSv1i/c2yHmbW6vfQtQHJqzZTlMKOSBKlr9NH7IlVaIGTJiIniMYwkKdaeICxjvBc9QOuzkqb6oEmFCyHfP6XeqtYMFOdrhChqhIU/xawjX8c6ziEoaSHafT+8BDT27nuElNS1IrfffG22L35qYhLqFk0vb+nZ72kCPHCrcGrkt+QuejVl3yWr7whDuf0ngRPMfluBxOUXtY98CEkue4nnn0QavNMa4oDE5oUkzZB1j2FpX0S2eP8Q4xOuIWiPiExnTbPz2hibsOJdxqJNzzhbuuuJM1mVJCU59IxiFgQtE5mn+vU7eSNQcuoahM89FKXLCuwiUUlWk+rDWEzVsnObiEolMKn6imeDeOHLiEoinIp+pF3uiWGQAuoWgT/3MVsfjhhn8ad7xN8V1aaNz0GeLOKGonvPV3iCvrq434R7e/S3HfUtEM8luMh4oJHZnTiE5ifIt5qcrqybi0tnB1feh2wp++xnetTvPza22O1ks3uIR1N2vev3E1b0f3LWa4nRlH955GwN01N/cPF7gd0vCW5ekbvT1g4C53KrkYWyS8w+/jT4AJJfOP4iyGwunGHBbQxJIjwsfzNCo3v4EnhkwueA69M1HIU1+SWZb/rHWuDXlyz8mzidDTl+7deqqAT9D23bkC/NcSeTF/q/VTklghT7I33Loi+2oKDGhSybRNyxyZ0CxsxymBvYBouaNJKeSUxpi17TglsK0jRHszSqABTWo7TglsQgdvya7ACe33FrqUgxO6N/dG96hxrqfCC7qnQuraPVlgGargWm8T7E3uA8f608xw1eATt25Z4j9C49Z9bujK6SRwZ6G/Ueq713Ulola/tv+g554rNTfFvon736L9141u70tj4txu2e23dv9Sc9gmsxgw0e9Be+Ttpiv1FskXosdRG1nG/1DoZbVk+Eu/F/ShG3Qnbw76wVfGe1P0897rDvLqotMZLaMIMGhG0fhpWl0nid+z2dH7A6G3/28PiubspT3ZXw3zY1f2WvGXdRqTEhEREREREREREREREREREREREREREREREdF38gcDoWHX3NyCJAAAAABJRU5ErkJggg==")+"' />");
					}
				});
			}
		},

		modalSettings: function(options) {
			var
				modal = $(this),
				personalSettings = strObj4rmDOM(modal.data("options")),
				settings = $.extend({}, {
					name: "Modal",
					namespace: "modal",
					class: {
						locker: "modal-lock",
						wrapper: "modal-wrap",
						blurring: "modal-blur"
					},
					closeOnEsc: true,
					closeOnWrapperClick: true,
					blurring: false,
					duration: 400,
					controller: undefined,
					ready: undefined,
					complete: undefined
				}, $.isPlainObject(options) ? options : {}, personalSettings)
			;
			
			settings.uniqueId = getUniqueId(settings.namespace);
			return settings;
		},

		openModal: function(options) {
			this.each(function() {
				if ($(this).hasClass("active")) { return; }
				
				var
					modal = $(this),
					mDialog = modal.children(".modal-dialog"),
					settings = modal.modalSettings(options),
					uniqueId = settings.uniqueId,
					EscTrack = getEscTrack()
				;

				if (typeof(settings.controller) === "function") {
					settings.controller(settings, modal);
				}

				settings.unlockInfo = lockScreen(settings.class.locker);
				
				if (settings.closeOnWrapperClick) {
					modal.on("click."+uniqueId, function(e) {
						var $target = $(e.target);

						if (!$target.closest(mDialog).length && !$target.closest(modal.children(".md-control")).length && !$target.closest(modal.children(".caption")).length) {
							modal.closeModal();
						}
					});
				}

				if (settings.closeOnEsc) {
					$(document).on("keyup."+uniqueId, function(e) {
						if (e.keyCode === 27) {
							if (checkEscStatus(EscTrack)) {
								modal.closeModal();
							}
						}
					});
				}

				modal.find(".exit-modal").on("click."+uniqueId, function() {
					modal.closeModal()
				});

				$(window).on("onSelectAll."+uniqueId, function(e) {
					e.parentEvent.preventDefault();
					setHighlightRange(modal);
				});

				// restrict focus range to within modal when the tab key is used
				$(document).on("keydown."+uniqueId, function(e) {
					focusRangeOnTab(modal, e);
				});

				if (settings.blurring) {
					$("body").addClass(settings.class.blurring+"-"+uniqueId);
				}

				if (mDialog.hasClass("self-scroll") && !modal.hasClass("flex-middle")) {
					modal.addClass("flex-middle");
				}

				modal.css("display", "flex").addClass("active");
				anime({
					target: modal[0],
					opacity: 1,
					duration: settings.duration/3
				});
				mDialog.addClass("animating");
				setTimeout(function() {
					mDialog.removeClass("animating");
					if (typeof(settings.ready)==="function") { settings.ready(settings, modal) }
					modal.attr("tabindex", -1).focus().scrollTop(0).data("settings", settings);
				}, settings.duration);
			});
		},

		closeModal: function(settings) {
			this.each(function() {
				if (!$(this).hasClass("active")) { return }

				var
					modal = $(this),
					mDialog = modal.children(".modal-dialog"),
					settings = settings || modal.data("settings"),
					uniqueId = settings.uniqueId
				;

				modal.removeClass("active");
				$(window).off("onSelectAll."+uniqueId);
				$(document).off("keydown."+uniqueId+" keyup."+uniqueId);

				if (settings.blurring) { $("body").removeClass(settings.class.blurring+"-"+uniqueId); }

				anime({
					target: modal[0],
					opacity: 0,
					duration: settings.duration/2
				});
				mDialog.addClass("animating");
				setTimeout(function() {
					unlockScreen(settings.unlockInfo);
					mDialog.removeClass("animating");
					modal.hide();
					if (typeof(settings.complete) === "function") { settings.complete(settings, modal) }

					if (elemExist(settings.initiator)) { settings.initiator.focus() }
				}, settings.duration);
			});
		}
	});

	$(document).ready(function() {
		$(".modal-trigger").modal();
		$("a[data-lightbox]").lightbox();
	});
})(jQuery, window, document);

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
