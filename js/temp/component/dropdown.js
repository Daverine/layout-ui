/*!
* Emmadave UI Dropdown
* Copyright 2016-2017 Folorunso David A.
*/

;(function ($, window) {

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
		$(document).on("click.dd", ".dropdown:not([data-findTrigger]):not([data-hover]):not(.sub), .dropdown.sub[data-hover='false']:not([data-hoverfindTrigger]), " +
			".dropdown[data-findTrigger]:not([data-hover]):not(.sub) > .trigger, .dropdown.sub[data-hover='false'][data-findTrigger] > .trigger", function (e) {
			$(e.target).dropdownInit(e);
		});

		$(document).on("mouseenter.dd",
			".dropdown[data-hover]:not([data-findTrigger]), .dropdown.sub:not([data-hover=false]):not([data-findTrigger]), "+
			".dropdown[data-hover][data-findTrigger] > .trigger, .dropdown.sub:not([data-hover=false])[data-findTrigger] > .trigger", function(e) {
			$(e.target).dropdownInit(e);
		});
	});

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
	
	$.fn.extend({
		dropdownInit: function(e) {
			var
				$target = $(this),
				dropdown = $target.closest(".dropdown"),
				settings = (!dropdown.data("initialized") === true)
					? dropdown.dropdownSettings()
					: dropdown.data("settings")
				, uniqueId = (dropdown.data("uniqueId"))
					? dropdown.data("uniqueId")
					: getUniqueId(settings.pluginName)
				, dropdownMenu
			;

			dropdown.data({
				uniqueId: uniqueId,
				settings: settings,
				initialized: true
			});

			dropdownMenu = (settings.browser)
				? $(settings.menuId).data("browsed", true)
				: dropdown.children(".drop.menu")
			;
			settings.e = e;
			dropdownMenu.attr("data-view", settings.view);
			uniqueId = dropdown.data("uniqueId");

			if (settings.page) { dropdownMenu.addClass("fixed"); }

			if (typeof(e) === "object") {
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
							dropdown.showDropdown(settings)
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
						
						if (!$target.closest(dropdownMenu).length) {				
							if (!dropdown.hasClass("active")) {
								setTimeout(function() {
									dropdown.showDropdown(settings)
								}, timeDelay)
							}
							else {
								setTimeout(function() {
									dropdown.hideDropdown(settings)
								}, timeDelay)
							}
						}
					}
				}
			}
			else {
				if (!dropdown.hasClass("active") || e === true) {
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
		},

		dropdownSettings: function() {
			var
				dropdown = $(this),
				defaults = {
					pluginName: "dropdown", constrainWidth: false,
					fluidMinWidth: false, delay: 0, duration: 300
				},
				personalSettings = strObj4rmDOM(dropdown.data("options")),
				settings = ($.isPlainObject(personalSettings))
					? $.extend(defaults, personalSettings)
					: defaults
			;

			settings.class = {pos: {lhs: "lhs", rhs: "rhs", upward: "upward", downward: "downward"}};
			settings.view = ((dropdown.hasClass("sub") && settings.view != "vertical") ||
				settings.view == "horizontal")
				? "horizontal" : "vertical"
			;
			settings.hover = (dropdown.is("[data-hover]") || (dropdown.hasClass("sub") && !dropdown.is("[data-hover=false]"))) ? true : false;
			settings.page = ((settings.page && !dropdown.hasClass("sub")) && !settings.hover)
				? true : false
			;				
			settings.browser = (dropdown.hasClass("browse")) ? true : false;
			settings.menuId = (settings.browser) ? dropdown.attr("href") || "#" + dropdown.data("target") : undefined;

			return settings;
		},

		showDropdown: function(settings, keyboard) {
			if ($(this).hasClass("active")) { return }

			var
				dropdown = $(this),
				dropdownMenu = ((settings.browser)
					? dropdownMenu = $(settings.menuId)
					: dropdown.children(".drop.menu")),
				items = dropdownMenu.find(".item").not(".xhover,.disabled"),
				directItems = dropdownMenu.children(".item").not(".xhover,.disabled"),
				uniqueId = dropdown.data("uniqueId"),
				posClass = settings.class.pos
			;

			dropdown.addClass("active");

			// Close on "Click Out"
			$(document).on("click."+uniqueId, function(e) {
				var $target = $(e.target);

				if (!$target.closest(dropdownMenu).length && !$target.closest(dropdown).length) {
					dropdown.hideDropdown(settings, true);
				}
			});

			// Escape key (Use to close dropdown) support
			$(document).on("keyup."+uniqueId, function(e) {
				if (e.keyCode === 27 && !dropdownMenu.find(".dropdown.active").length) {
					if (e.isDefaultPrevented()) { return }
					
					e.preventDefault();
					dropdown.hideDropdown(settings);
				}
			});

			// Arrow left key (Use to close a sub dropdown) support
			if (dropdown.hasClass("sub")) {
				$(document).on("keydown.a"+uniqueId, function(e) {
					if (e.keyCode === 37 && !dropdownMenu.find(".dropdown.active").length) {
						if (e.isDefaultPrevented()) { return }
						
						e.preventDefault();
						dropdown.hideDropdown(settings);
					}
				})
			}

			// Close dropdown when a item is clicked
			directItems.not(".dropdown").click(function(e) {
				dropdown.hideDropdown(settings, true);
			});

			/*
				The Enter key triggers the click action on an item
				Enter and right arrow key open a sub dropdown that is hovered.
			*/
			$(document).on("keydown.b" + uniqueId, function(e) {
				if ((e.keyCode === 13 || e.keyCode === 39) &&
					dropdownMenu.children(".item").filter(".hovered.dropdown").length) {
					e.preventDefault();
					dropdownMenu.children(".item").filter(".hovered.dropdown")
						.first().dropdownInit(true);
				}
				else if (e.keyCode === 13 &&
					dropdownMenu.children(".item").filter(".hovered").length) {
					e.preventDefault();
					dropdownMenu.children(".item").filter(".hovered").first()[0].click();
				}
			});

			/* A mousemove function to trigger when on keyboard navigation mode. */
			function mouseMover(e) {
				var $target = $(e.target), $hovered = dropdownMenu.children(".item.hovered");

				if ($target.closest(dropdown).length ||
					$target.closest(dropdownMenu).length) {
					if (!$target.closest($hovered).length) {
						$hovered.removeClass("hovered");
						if ($target.closest(directItems)) {
							$target.closest(directItems).addClass("hovered");
						}
					}
					else { $hovered.addClass("hovered") }
				}
				else if (settings.hover) { dropdown.hideDropdown(settings); }

				itemsHoverEvent();
			}

			/* Invoke a function to trigger the hover event on dropdown menu item. */
			function itemsHoverEvent() {
				directItems.on("mouseenter."+uniqueId, function() {
					$(this).addClass("hovered")
				});

				directItems.on("mouseleave."+uniqueId, function() {
					$(this).removeClass("hovered")
				})
			}

			itemsHoverEvent();

			/* Up and down arrrow key navigation on dropdown menu item. */
			$(document).on("keydown.c"+uniqueId, function(e) {
				if ((e.keyCode === 38 || e.keyCode === 40)) {
					if (!dropdownMenu.find(".dropdown.active").length) {
						e.preventDefault();
						directItems.off("mouseenter."+uniqueId+" mouseleave."+uniqueId);

						var
							lfii = (directItems.filter(".hovered").length)
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

						lfi = directItems.eq(nfii).addClass("hovered");
						directItems.not(lfi).removeClass("hovered");
					}

					$(document).off("mousemove.2"+uniqueId).one("mousemove.2"+uniqueId, mouseMover);
				}
			});

			if (keyboard) {
				directItems.first().addClass("hovered");
				directItems.off("mouseenter."+uniqueId+" mouseleave."+uniqueId);

				$(document).one("mousemove.1"+uniqueId, mouseMover);
			}

			dropdownMenu.removeClass("hidden").show().addClass("visible animating");

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
					dropdownMenu.removeClass("upward downward rhs lhs")
						.css({"max-width": "", "min-width": ""});

					var
						windowHeight = window.innerHeight,
						dropdownHeight = dropdown.outerHeight(),
						dropdownMenuHeight = dropdownMenu.outerHeight(true),
						offsetLeft = dropdown.offset().left - $(window).scrollLeft(),
						offsetRight = $(window).width() - offsetLeft - dropdown.outerWidth(),
						offsetTop = dropdown.offset().top - $(window).scrollTop(),
						dropdownPosition = dropdown.position(),
						overflowParent = dropdown.parents().not("body").filter(function() {
							if ($(this).css("overflow-y") == "auto" ||
								$(this).css("overflow-y") == "scroll") { return $(this) }
						}).first(),
						availBottom, availTop
					;

					if (settings.fluidMinWidth) {
						dropdownMenu.css("min-width", dropdown.outerWidth())
					}

					if (settings.constrainWidth) {
						dropdownMenu.css({
							"max-width": dropdown.outerWidth(),
							"width": dropdown.outerWidth()
						})
					}

					if (settings.view === "horizontal") {
						if (!overflowParent.length) {
							availTop = offsetTop + dropdownHeight;
							availBottom = windowHeight - offsetTop;
						}
						else {
							availTop = offsetTop - overflowParent.offset().top + dropdownHeight;
							availBottom = overflowParent.get(0).clientHeight - availTop - dropdownHeight;
						}

						if (offsetRight >= dropdownMenu.outerWidth()) {
							dropdownMenu.addClass("rhs");
						}
						else if (offsetLeft >= dropdownMenu.outerWidth()) {
							dropdownMenu.addClass("lhs");
						}
						else if (offsetRight >= offsetLeft) {
							dropdownMenu.addClass("rhs").css("max-width", offsetRight);
							dropdownMenuHeight = dropdownMenu.outerHeight();
						}
						else {
							dropdownMenu.addClass("lhs").css("max-width", offsetLeft);
							dropdownMenuHeight = dropdownMenu.outerHeight();
						}

						if (settings.browser) {
							if (dropdownMenu.hasClass("rhs")) {
								dropdownMenu.css("left", dropdownPosition.left + dropdown.outerWidth());
							}
							else {
								dropdownMenu.css("left", dropdownPosition.left - dropdownMenu.outerWidth());
							}
						}
					}
					else if (settings.view === "vertical") {
						if (!overflowParent.length) {
							availTop = offsetTop;
							availBottom = windowHeight - offsetTop - dropdownHeight;
						}
						else {
							availTop = offsetTop - overflowParent.offset().top;
							availBottom = overflowParent.get(0).clientHeight - availTop - dropdownHeight;
						}

						if (!dropdownMenu.hasClass("board")) {
							if (offsetRight + dropdown.outerWidth() >= dropdownMenu.outerWidth()) {
								dropdownMenu.addClass("rhs");
							}
							else if (offsetLeft + dropdown.outerWidth() >= dropdownMenu.outerWidth()) {
								dropdownMenu.addClass("lhs");
							}
							else if (offsetRight >= offsetLeft) {
								dropdownMenu.addClass("rhs").css("max-width", offsetLeft + dropdown.outerWidth());
							}
							else {
								dropdownMenu.addClass("lhs").css("max-width", offsetRight + dropdown.outerWidth());
							}

							if (settings.browser) {
								if (dropdownMenu.hasClass("rhs")) {
									dropdownMenu.css("left", dropdownPosition.left)
								}
								else {
									dropdownMenu.css("left", dropdownPosition.left + dropdown.outerWidth() - dropdownMenu.outerWidth());
								}
							}
						}	
					}

					availTop -= 5, availBottom -= 5;

					if (availBottom >= dropdownMenuHeight) {
						dropdownMenu.addClass("downward");
					}
					else if (availTop >= dropdownMenuHeight) {
						dropdownMenu.addClass("upward");
					}
					else if (availBottom >= availTop) { 
						dropdownMenu.addClass("downward"); 
					}
					else if (availTop + ((overflowParent.length) ? overflowParent : $(window)).scrollTop() > dropdownMenuHeight) {
						dropdownMenu.addClass("upward");
					}
					else {
						dropdownMenu.addClass("downward");
					}
					
					if (settings.browser) {
						dropdownMenu.css("bottom", "auto");

						if (dropdownMenu.hasClass("downward")) {
							if (settings.view === "vertical") {
								dropdownMenu.css({
									"top": dropdownPosition.top + dropdown.outerHeight()
								})
							}
							else if (settings.view === "horizontal") {
								dropdownMenu.css("top", dropdownPosition.top)
							}
						}
						else if (dropdownMenu.hasClass("upward")) {
							if (settings.view === "vertical") {
								dropdownMenu.css({
									"top": dropdownPosition.top - dropdownMenuHeight
								})
							}
							else if (settings.view === "horizontal") {
								dropdownMenu.css({
									"top": dropdownPosition.top - dropdownMenuHeight + dropdownHeight
								})
							}
						}
					}
				}
			});

			$(window).trigger("resize." + uniqueId);
			setTimeout(function() { dropdownMenu.removeClass("animating") }, settings.duration);
		},

		hideDropdown: function(settings, closeAll) {
			if (!$(this).hasClass("active")) { return }

			var
				dropdown = $(this),
				dropdownMenu =(settings.browser) ? $(settings.menuId) : dropdown.children(".drop.menu"),
				items = dropdownMenu.find(".item").not(".xhover,.divider"),
				directItems = dropdownMenu.children(".item").not(".xhover,.divider"),
				uniqueId = dropdown.data("uniqueId")
			;

			dropdown.off("mouseleave."+uniqueId);
			$(window).off("resize." + uniqueId);
			$(document).off("keydown.a"+uniqueId+" keydown.b"+uniqueId+" keydown.c"+uniqueId+" keyup."+uniqueId+" click."+uniqueId+" mousemove.2"+uniqueId);
			directItems
				.off("mouseenter." + uniqueId + " mouseleave."+uniqueId)
				.removeClass("hovered");
			dropdownMenu.find(".dropdown").filter(".active").each(function() {
				$(this).hideDropdown($(this).data("settings"));
			});
			directItems.removeClass("hovered");
			dropdown.removeClass("active");
			dropdownMenu.removeClass("visible").addClass("animating");
			setTimeout(function() {
				dropdownMenu.hide().addClass("hidden")
					.removeClass("upward downward rhs lhs animating")
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

})(jQuery);
