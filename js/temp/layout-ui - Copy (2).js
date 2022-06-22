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
	return ($(elem).index() < 0)
}

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

function focusRangeOnTab(range) {
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
				$active
			;

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
* Copyright 2016-2017 David A.
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
								current.animate({opacity: 0}, {duration: options.transitionTiming});
								next.animate({opacity: 1}, {duration: options.transitionTiming/10});
								switcher(current, next, options.transitionTiming);
							},

							'scale': function(current, next) {
								current.addClass("scale").animate({opacity: 0}, {
									duration: options.transitionTiming,
									complete: function() { $(this).removeClass("scale")}
								});
								next.animate({opacity: 1}, {duration: options.transitionTiming/2});
								switcher(current, next, options.transitionTiming);
							},

							'slide': function(current, next) {
								var
									currentIndex = slides.index(current),
									nextIndex= slides.index(next),
									slideAmt = -(nextIndex * (100/options.nSlides)) + "%"
								;
								//slides.animate({"left": +slideAmt}, {duration: options.transitionTiming});
								slider.animate({"left": slideAmt}, {duration: options.transitionTiming});
								switcher(current, next, options.transitionTiming);
							},

							'scroll': function(current, next) {
								var
									currentIndex = slides.index(current),
									nextIndex= slides.index(next),
									slideAmt = -(nextIndex * (100/options.nSlides)) + "%"
								;

								slider.animate({"top": slideAmt}, {duration: options.transitionTiming});
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
* emmandave UI Collapsible
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
					cOffset = $this.prev(titleClass).offset().top, offset = 0, sroll
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
					overflowParent.animate({ scrollTop: offset }, options.duration)
				}
			}

			function animateOpen ($elem, xPre) {
				$elem.stop(true, false).slideDown({
					duration: options.duration, queue: false,
					complete: function() {
						if (options.scrollToView && xPre) { scrollToView($elem) }
					}
				});
			}

			function animateClose ($elem) {
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
				$(this).animate(
					{ scrollTop: scrollAmt - settings.topSpacing },
					{ duration: settings.duration || 200 }
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
				lastProps = {},
				settings = strObj4rmDOM($element.data("options"))
			;
			
			settings = ($.isPlainObject(settings))
				? $.extend(options, settings)
				: options
			;

			// adjust settings
			settings.parentGuide = settings.sticky
				? true
				: settings.parentGuide
			;
			settings.uniqueId = getUniqueId(settings.namespace);


			// update function
			function update() {
				$element.attr("style", props.style || "");
				settings.lastControl = "";
				props.position = $element.position();
				props.offset = $element.offset();
				props.height = $element.outerHeight();
				props.width = $element.outerWidth();
				props.marginL = (parseFloat($element.css("marginLeft")));
				props.marginT = (parseFloat($element.css("marginTop")));
				
				// adjust offset with margins
				props.offset.left -= props.marginL;
				props.offset.top -= props.marginT;

				// adjust settings
				settings.independent = (props.height >= $(window).height()) ? true : false;

				// needed if pinned element needs to be contained inside the parent element"s boundaries
				if (settings.parentGuide) {
					var
						$parent = $element.parent(),
						lastScroll = $(window).scrollTop()
			 		;
						
					props.pHeight = $parent.outerHeight();
					props.pOffset = $parent.offset();
				}
				
				$element.css({
					"zIndex": settings.zIndex
				}).removeClass(settings.className);

				// off a previously set callback function (if any) and re-on the scroll.settings.uniqueId event
				$(window).off("scroll."+settings.uniqueId).on("scroll."+settings.uniqueId, function() {
					var
						scroll = $(window).scrollTop(),
						$rp = $element.parents().not(function() { return ($(this).css("position") == "static") ? true : false }).first() || $("body") // parent that is not static
					;

					if (settings.independent) {
						// pin the element at the bottom
						if ($element.css("position") != "fixed" &&
							scroll >= lastScroll &&
							$element.offset().top + props.height + settings.bottomSpacing <= scroll + $(window).height() &&
							(!settings.parentGuide || props.pOffset.top + props.pHeight - settings.bottomSpacing - parseFloat($parent.css("padding-bottom")) >= scroll + $(window).height())
						) {
							$element.css({
								"top": $(window).height() - settings.bottomSpacing - props.height,
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
							$element.offset().top - settings.topSpacing >= scroll &&
							scroll >= props.offset.top + settings.topSpacing
						) {
							$element.css({
								"position": "fixed",
								"top": settings.topSpacing,
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
						else if (settings.parentGuide && props.pOffset.top + props.pHeight - settings.bottomSpacing - parseFloat($parent.css("padding-bottom")) <= scroll + $(window).height()) {
							$element.css({
								"top": props.pHeight - props.height - settings.bottomSpacing - parseFloat($parent.css("padding-bottom")),
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
						// unpin the element if the page scrolls to where the initial offset of the element is visible
						else if (props.offset.top - settings.topSpacing >= scroll) {
							$element.css({
								"position": "absolute",
								"top": props.offset.top - $rp.offset().top + settings.topSpacing,
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
						if (
							(!settings.sticky || (scroll >= lastScroll && settings.lastControl != "unpin2")) &&
							scroll > props.offset.top - settings.topSpacing &&
							(!settings.parentGuide || props.pHeight + props.pOffset.top - scroll > props.height + settings.topSpacing + parseFloat($parent.css("padding-bottom")) + settings.bottomSpacing) &&
							$element.css("position") != "fixed"
						) {
							$element.css({
								"position": "fixed",
								"top": settings.topSpacing,
								"left": props.offset.left
							}).addClass(settings.className);
							// fix for the use of relative width on the element.
							$element[0].style.setProperty("width", props.width + "px", "important");

							if (settings.pinned && typeof settings.pinned == "function") {
								settings.pinned($element);
							}
							settings.lastControl = "pin1";
						}
						else if (settings.sticky &&
							(settings.lastControl == "unpin2" && scroll < lastScroll) &&							
							props.pOffset.top + props.pHeight >= scroll + $(window).height() &&
							$(window).height() + scroll - props.pOffset.top > props.height + props.offset.top - $rp.offset().top + settings.topSpacing + settings.bottomSpacing &&
							$element.css("position") != "fixed"
						) {
							$element.css({
								"position": "fixed",
								"top": $(window).height() - props.height - settings.bottomSpacing,
								"left": props.offset.left
							}).addClass(settings.className);
							// fix for the use of relative width on the element.
							$element[0].style.setProperty("width", props.width + "px", "important");

							if (settings.pinned && typeof settings.pinned == "function") {
								settings.pinned($element);
							}
							settings.lastControl = "pin2";
						}
						else if (
							(props.offset.top - settings.topSpacing) >= scroll &&
							(!settings.sticky || (
								settings.lastControl != "pin2" || (scroll <= lastScroll && props.height + props.offset.top - $rp.offset().top + settings.topSpacing + settings.bottomSpacing >= scroll + $(window).height() - props.pOffset.top)
							)) &&
							$element.css("position") != "absolute"
						) {
							$element.css({
								"position": "absolute",
								"left": props.offset.left - $rp.offset().left,
								"top": props.offset.top - $rp.offset().top + settings.topSpacing,
							}).removeClass(settings.className);
							// fix for the use of relative width on the element.
							$element[0].style.setProperty("width", props.width + "px", "important");

							if (settings.unpinned && typeof settings.unpinned == "function") {
								settings.unpinned($element);
							}
							settings.lastControl = "unpin1";
						}
						else if (
							settings.parentGuide &&
							(scroll >= props.pOffset.top + props.pHeight - props.height - settings.topSpacing - settings.bottomSpacing - parseFloat($parent.css("padding-bottom")) ||
								(settings.lastControl == "pin2" && (scroll > lastScroll && props.pOffset.top + props.pHeight - settings.bottomSpacing - parseFloat($parent.css("padding-bottom")) <= scroll + $(window).height() - settings.bottomSpacing - parseFloat($parent.css("padding-bottom"))))) &&
							$element.css("position") != "absolute"
						) {
							$element.css({
								"position": "absolute", 
								"top": props.pHeight - parseFloat($parent.css("padding-bottom")) - settings.bottomSpacing - props.height,
								"left": props.offset.left - $rp.offset().left
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
					lastProps.position = $element.position();
				});

				// trigger the scroll event so that computations take effect
				$(window).trigger("scroll." + settings.uniqueId); 
			}

			// update elements" position
			update();

			// on window resize update elements" position
			$(window).on("resize.scrollPin", function() {
				update();
			});
		});
	};

	$(document).ready(function() {
		$(".scroll-pin").scrollPin();
	})
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
* Emmadave UI Dropdown
* Copyright 2016-2017 Folorunso David A.
*/

(function ($, window, document, undefined) {

	"use strict";

	window = (typeof window != "undefined" && window.Math == Math)
		? window
		: (typeof self != "undefined" && self.Math == Math)
			? self
			: Function('return this')()
	;

	var ddTemp = {}, mouseTarget;

	$(document).mousemove(function(e) {
		mouseTarget = $(e.target);
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
					: dropdown.children(".drop.menu")
				;
				settings.e = e;
				dropdownMenu.attr("data-view", settings.view);

				if (!dropdown.data("initialized")) {
					if (settings.page) { dropdownMenu.addClass("fixed"); }
					/* open dropdown if the enter key or arrow down key is pressed && dropdown has :focus */
					$(document).on("keydown.ms0"+uniqueId, function(e) {
						if ((e.keyCode === 13 || e.keyCode === 40) && $(":focus").closest(dropdown).length && !dropdown.hasClass("active")) {
							e.preventDefault();
							dropdown.showDropdown(settings, true);
						}
					});
					
					/* create search box for search dropdown */
					if (settings.selectable && dropdown.hasClass("search")) {
						dropdown.prepend("<input class='search' autocomplete='off' tabindex='0'></div>");
						dropdown.removeAttr("tabindex");
						searchBox = dropdown.children("input.search");
						if (dropdown.hasClass("multiple")) { searchBox.after("<span class='sizer'>"); }

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
							else if ($target.closest(dropdown.find(".content > .label")).length && !$target.closest(dropdown.find(".content > .label")).hasClass("active")) {
								var  cc = $target.closest(dropdown.find(".content > .label")).addClass("active");

								if (!e.ctrlKey) { cc.siblings(".label").removeClass("active"); }
							}
							else if (!$target.closest(dropdown.find(".content > .label")).length && dropdown.find(".content > .label").hasClass("active")) {
								dropdown.find(".content > .label").removeClass("active");
							}
						});

						$(document).on("keydown.ms1"+uniqueId, function(e) {
							if (dropdown.find(".content > .label.active").length) {
								if (e.keyCode === 8 || e.keyCode === 46) {
									var cc = dropdown.find(".content > .label.active");

									if (e.keyCode === 8 && cc.first().prev().length) { cc.first().prev().addClass("active"); }
									else if (e.keyCode === 8 && cc.last().next().length) { cc.last().next().addClass("active"); }
									else if (e.keyCode === 46 && cc.last().next().length) { cc.last().next().addClass("active"); }
									else if (e.keyCode === 46 && cc.first().prev().length) { cc.first().prev().addClass("active"); }

									cc.children(".close").click();
								}
								else if (e.keyCode === 40) {
									dropdown.find(".content > .label").removeClass("active");
									dropdown.showDropdown(settings, true);
								}
								else if (e.keyCode === 39) {
									var cc = dropdown.find(".content > .label.active").last();
									if (cc.next().length) {
										cc.next().addClass("active");
										if (!e.shiftKey) { cc.removeClass("active").siblings().not(cc.next()).removeClass("active"); }
									}
								}
								else if (e.keyCode === 37) {
									var cc = dropdown.find(".content > .label.active").first();
									if (cc.prev().length) {
										cc.prev().addClass("active");
										if (!e.shiftKey) { cc.removeClass("active").siblings().not(cc.prev()).removeClass("active"); }
									}
								}
							}
							/* delete the last label in multiple dropdown if searchbox is focused on and seachbox is empty and the backspace key is pressed */
							else if (dropdown.hasClass("search") && e.keyCode === 8 && !searchBox.val().length && searchBox.is(":focus") && dropdown.find(".content > .label > .close").length) {
								dropdown.find(".content > .label > .close").last().click();
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
							trigger = dropdown.add(dropdownMenu),
							timeDelay = settings.delay || 300,
							checker = dropdown.add(dropdownMenu)
						;

						/* checkerFill is a function to find all sub dropdownMenu
							 that was linked to it dropdown (ie the trigger) by id and
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

						if (e.type == "mouseenter") {
							trigger.one("mouseleave."+uniqueId, function(e) { dropdown.dropdownInit(e); });
							clearTimeout(ddTemp["hdt"+uniqueId]);
							ddTemp["sdt"+uniqueId] = setTimeout(function() {
								dropdown.showDropdown(settings, dropdown.hasClass("search") ? true : false)
							}, timeDelay*3/4);
						}
						else if (e.type == "mouseleave") {
							clearTimeout(ddTemp["sdt"+uniqueId]);
							ddTemp["hdt"+uniqueId] = setTimeout(function() {
								if (mouseTarget.closest(checker).length) {
									trigger.one("mouseleave."+uniqueId, function(e) { dropdown.dropdownInit(e); });
								}
								else { dropdown.hideDropdown(settings); }
							}, timeDelay);
						}
					}
					else {
						var timeDelay = settings.delay || 0;

						if (!$target.closest(dropdownMenu).length) {
							e.preventDefault();
							
							if (dropdown.hasClass("active")) {
								if (dropdown.hasClass("search")) { searchBox.focus();  return; }
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
				defaults = {
					pluginName: "dropdown", constrainWidth: false,
					fluidMinWidth: false, delay: 0, duration: 300,
					class: {pos: {lhs: "lhs", rhs: "rhs", upward: "upward", downward: "downward"}}
				},
				personalSettings = strObj4rmDOM(dropdown.data("options")),
				settings = ($.isPlainObject(personalSettings))
					? $.extend(defaults, personalSettings)
					: defaults
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
					: dropdown.children(".drop.menu")),
				items = dropdownMenu.find(".item").not(".xhover,.disabled"),
				directItems = dropdownMenu.find("> .item, > .items > .item").not(".xhover,.disabled,.filtered"+(!dropdown.is(".indicating.multiple") ? ",.selected":"")),
				sInput = dropdown.children("input[type=hidden]"),
				sContent = dropdown.children(".content"),
				uniqueId = dropdown.data("uniqueId"),
				posClass = settings.class.pos
			;

			if (settings.selectable && dropdown.hasClass("search")) {
				var searchBox = dropdown.children("input.search").focus();
				
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
					else { dropdown.hideDropdown(settings, true); }
				}
				/* do something when an item is clicked */
				else if ($target.closest(dropdownMenu.find("> .item, > .items > .item").not(".disabled,.xhover,.selected")).length) {
					if ($target.closest(".item").hasClass("dropdown")) { return; }
					if (settings.selectable) { 
						setSelect($target.closest(".item"), (dropdown.hasClass("multiple") ? true : false));
					}
					else { dropdown.hideDropdown(settings, true); }
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
				if ((e.keyCode === 27 || (e.keyCode === 9 && (!$(":focus").closest(dropdown).length || !$(":focus").closest(dropdownMenu).length))) &&
					!dropdownMenu.find(".dropdown.active").length && !e.isDefaultPrevented()) {
					e.preventDefault();
					if (settings.selectable) { setSelect(); }
					else { dropdown.hideDropdown(settings, true); }				}
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

						/* Enable scroll of oveflow parent to hovered-item to make the hovered item visible */
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
							dropdownMenu.css({"top": 0, "max-height": $(window).width()});
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
						aOp = getOP.length ? getOP : $(window),
						opProp = {
							height: aOp.innerHeight(),
							width: aOp.innerWidth(),
							top: getOP.length ? aOp.offset().top : documentOffset().top,
							left: getOP.length ? aOp.offset().left : documentOffset().left,
							tScroll: getOP.length ? aOp.scrollTop() : $(document).scrollTop(),
							lScroll: getOP.length ? aOp.scrollLeft() : $(document).scrollLeft()
						},
						dProp = {
							height: dropdown.outerHeight(),
							width: dropdown.outerWidth(),
							top: getOP.length ? dropdown.offset().top - opProp.top + opProp.tScroll : dropdown.offset().top,
							left: getOP.length ? dropdown.offset().left - opProp.left + opProp.lScroll : dropdown.offset().left,
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
							op.animate(
								{ scrollTop: Math.max(dProp.top - dmProp.height - 10, dProp.top - opProp.height + dProp.height + 5) },
								{ duration: settings.duration/2 }
							);
						}, settings.duration);
					}
					else {
						dropdownMenu.addClass("downward");
						setTimeout(function() {
							op.animate(
								{ scrollTop: Math.min(dProp.top - opProp.height + dProp.height + dmProp.height + 10, dProp.top - 5) },
								{ duration: settings.duration/2 }
							);
						}, settings.duration);
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

			dropdownMenu.removeClass("hidden").show().addClass("visible animating");
			dropdownMenu.trigger("refresh", [keyboard ? false : true]);
			
			setTimeout(function() { dropdownMenu.removeClass("animating"); }, settings.duration);
		},

		hideDropdown: function(settings, closeAll) {
			if (!$(this).hasClass("active")) { return }

			var
				dropdown = $(this),
				dropdownMenu = (settings.browser) ? $(settings.menuId) : dropdown.children(".drop.menu"),
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
				dropdownMenu.hide().addClass("hidden").removeClass("upward downward rhs lhs animating");
				directItems.removeClass("hovered");
			}, settings.duration);

			if (closeAll) {
				var browsedC = dropdown.parents(".drop.menu").filter(function() {
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
* Emmadave UI Modal
* Copyright 2016-2017 Folorunso David A.
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
		openModal: function(options) {
			this.each(function() {
				var
					$element = $(this),
					settings = $element.modalSettings(options),
					id, actions, $layer
				;

				if ($element.hasClass("active")) { return }

				id = getUniqueId(settings.namespace);
				$element
					.addClass("active")
					.wrap("<div class='" + settings.class.layer + "'>")
				;
				settings.unlockInfo = lockScreen(settings.class.locker);
				$layer = $element.parent();
				
				if (settings.closeOnLayerClick) {
					$layer.on("click."+id, function(e) {
						var $target = $(e.target);

						if (!$target.closest($layer.children()).length) {
							$element.closeModal();
						}
					});
				}

				if (settings.closeOnEsc) {
					$layer.on("keyup."+id, function(e) {
						if (e.keyCode === 27) {
							$element.closeModal();
						}
					});
				}

				$layer.on("click."+id, " .close", function() {
					$element.closeModal() 
				});

				if (settings.blurring) {
					if ($("body").hasClass(settings.class.blurring)) {
						settings.preBlured = true; 
					}
					else {
						$("body").addClass(settings.class.blurring);
					}
				}

				$(window).on("onSelectAll."+id, function(e) {
					e.parentEvent.preventDefault();
					setHighlightRange($element);
				});

				$layer.on("keydown."+id, function(e) {
					focusRangeOnTab($layer);
				});

				$element.data("settings", settings);

				if ($element.hasClass("self-scroll")) {
					$layer.css("display", "flex");
					$element.css("margin", "0")
				}
				else { $layer.show() }

				$element.addClass("animating").show();
				setTimeout(function() {
					$element.removeClass("animating");
					if (typeof(settings.ready)==="function") { settings.ready() }
					$layer.attr("tabindex", -1).focus().scrollTop(0);
					$element.data("settings", settings);
				}, settings.duration);
			});
		},

		closeModal: function(options) {
			this.each(function() {
				var
					$element = $(this),
					settings = $element.modalSettings(options),
					id, actions, $layer
				;

				if (!$element.hasClass("active")) { return }

				$layer = $element.parent();
				$element.removeClass("active");
				$layer.css("overflow", "hidden");
				$(window).off("onSelectAll."+id);

				if (settings.blurring && !settings.preBlured) { $("body").removeClass("modal-blur"); }

				$layer.animate({opacity: 0}, { duration: settings.duration, easing: "swing", queue: false });
				$element.addClass("animating");
				setTimeout(function() {
					unlockScreen(settings.unlockInfo);
					$element.removeClass("animating").css("margin", "").hide().unwrap();

					if (typeof(settings.complete) === "function") { settings.complete() }

					if (elemExist(settings.lastFocus)) { settings.lastFocus.focus() }
				}, settings.duration);
			});
		},

		modal: function(options) {
			options = options || {};

			this.each(function() {
				var
					$this = $(this),
					modal = $($(this).attr("href") || "#" + $(this).data("target"))
				;

				$this.click(function() {
					options.lastFocus = $this;
					modal.openModal(options);
				});
			});
		},

		modalSettings: function(options) {
			var
				defaults = {
					name: "Modal",
					namespace: "modal",
					class: {
						locker: "modal-lock",
						layer: "modal-overlay",
						blurring: "modal-blur"
					},
					closeOnEsc: true,
					closeOnLayerClick: true,
					blurring: false,
					duration: 400,
					ready: undefined,
					complete: undefined
				},
				personalSettings = $(this).data("settings"),
				settings = ($.isPlainObject(options))
					? $.extend(defaults, options)
					: defaults
			;

			settings = ($.isPlainObject(personalSettings))
				? $.extend(settings, personalSettings)
				: settings
			;

			return settings;
		}
	});

	$(document).ready(function() { $(".modal-trigger").modal() });
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
