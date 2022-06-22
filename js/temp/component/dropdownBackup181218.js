/*!
* Emmadave UI Dropdown
* Copyright 2016-2017 Folorunso David A.
*/

(function ($) {

	$.fn.extend({
		dropdown: function(options) {
			options = options || {};

			this.each(function() {
				var
					defaults = {
						pluginName: "dropdown", hover: false, browser: false,
						findTrigger: false, constrainWidth: false,
						fluidMinWidth: false, delay: undefined,
						inDuration: 300, outDuration: 300
					},
					options = $.extend(defaults, options),
					dropdown = $(this), dropdownMenu, uniqueId, trigger
				;

				if (dropdown.hasClass("browse")) {
					options.browser = true;
					options.menuId = dropdown.attr("href") || "#" + dropdown.data("target");
				}

				if (dropdown.is("[data-findTrigger]") && dropdown.data("findTrigger") != false) {
					options.findTrigger = true;
				}

				dropdownMenu = (options.browser)
					? $(options.menuId).data("browsed", true) : dropdown.children(".drop.menu");
				dropdown.data("uniqueId", uniqueid(options.pluginName));
				uniqueId = dropdown.data("uniqueId");
				trigger = (options.findTrigger && dropdown.find(".trigger").filter(function() {
						if (!$(this).closest(".drop.menu", dropdown).length) { return $(this) }
					}).length)
					? dropdown.find(".trigger").filter(function() {
						if (!$(this).closest(".drop.menu", dropdown).length) { return $(this) }
					}).first()
					: dropdown;

				if (dropdownMenu.is("[data-constrainWidth]") &&
					dropdownMenu.data("constrainWidth") !== "false") {
					options.constrainWidth = true
				}
				else { options.constrainWidth = false }

				if (dropdownMenu.is("[data-fluidMinWidth]") &&
					dropdownMenu.data("fluidMinWidth") !== "false") {
					options.fluidMinWidth = true
				}
				else if (dropdownMenu.data("fluidMinWidth") === "false") {
					options.fluidMinWidth = false
				}

				if ((dropdown.is("[data-hover]") && dropdown.data("hover") != false) ||
					(dropdown.hasClass("sub") && dropdown.data("hover") != false)) {
					options.hover = true
				}

				if (dropdown.hasClass("sub") && dropdownMenu.data("view") != "vertical") {
					dropdownMenu.attr("data-view", "horizontal")
				}

				if (dropdownMenu.data("view") != "horizontal") { options.view = "vertical" }
				else { options.view = "horizontal" }

				dropdown.data("options", options);

				if (options.hover) {
					var showDelayTimer, hideDelayTimer, timeDelay = options.delay || 250;

					trigger = (!options.browser) ? trigger : trigger.add(dropdownMenu);

					trigger.mouseenter(function(e) {
						clearTimeout(hideDelayTimer);

						showDelayTimer = setTimeout(function() {
							dropdown.showDropdown(options)
						}, timeDelay);

						if (dropdown.hasClass("active")) { clearTimeout(showDelayTimer) }
					});

					trigger.mouseleave(function(e) {
						clearTimeout(showDelayTimer);

						hideDelayTimer = setTimeout(function() {
							dropdown.hideDropdown(options);
						}, timeDelay);

						if (!dropdown.hasClass("active")) { clearTimeout(hideDelayTimer) }
					})
				}
				else {
					trigger.click(function(e) {
						var target = $(e.target), timeDelay = options.delay || 0;

						if (!target.closest(dropdownMenu).length) {
							e.preventDefault();

							if (!dropdown.hasClass("active")) {
								setTimeout(function() {
									dropdown.showDropdown(options)
								}, timeDelay)
							}
							else if (dropdown.hasClass("active")) {
								setTimeout(function() {
									dropdown.hideDropdown(options)
								}, timeDelay)
							}
						}
					})
				}
			})
		},

		showDropdown: function(options, keyboard) {
			if ($(this).hasClass("active")) { return }

			var
				dropdown = $(this),
				dropdownMenu = ((options.browser)
					? dropdownMenu = $(options.menuId)
					: dropdown.children(".drop.menu")),
				items = dropdownMenu.find(".item").not(".xhover,.disabled"),
				directItems = dropdownMenu.children(".item").not(".xhover,.disabled"),
				trigger = (options.findTrigger && dropdown.find(".trigger").filter(function() {
						if (!$(this).closest(".drop.menu", dropdown).length) { return $(this) }
					}).length)
					? dropdown.find(".trigger").filter(function() {
						if (!$(this).closest(".drop.menu", dropdown).length) { return $(this) }
					}).first()
					: dropdown,
				uniqueId = dropdown.data("uniqueId")
			;

			dropdown.addClass("active");

			// Close on "Click Out"
			$(document).on("click." + uniqueId, function(e) {
				var target = $(e.target);

				if (!target.closest(trigger).length && !target.closest(dropdownMenu).length) {
					dropdown.hideDropdown(options, true);
				}
			});

			// Escape key (Use to close dropdown) support
			$(document).on("keyup." + uniqueId, function(e) {
				if (e.keyCode === 27 && !dropdownMenu.find(".dropdown.active").length) {
					if (e.isDefaultPrevented()) { return }
					
					e.preventDefault();
					dropdown.hideDropdown(options);
				}
			});

			// Arrow left key (Use to close a sub dropdown) support
			if (dropdown.hasClass("sub")) {
				$(document).on("keydown.a" + uniqueId, function(e) {
					if (e.keyCode === 37 && !dropdownMenu.find(".dropdown.active").length) {
						if (e.isDefaultPrevented()) { return }
						
						e.preventDefault();
						dropdown.hideDropdown(options);
					}
				})
			}

			// Close dropdown when a item is clicked
			directItems.not(".dropdown").click(function(e) {
				dropdown.hideDropdown(options, true);
			});

			// Enter key (Use to trigger item click action) and arrow right key (Use to open a sub dropdown) support
			$(document).on("keydown.b" + uniqueId, function(e) {
				if ((e.keyCode === 13 || e.keyCode === 39) &&
					dropdownMenu.children(".item").filter(".hovered.dropdown").length) {
					var $this = dropdownMenu.children(".item").filter(".hovered.dropdown").first()

					$this.showDropdown($this.data("options"), true);
				}
				else if (e.keyCode === 13 &&
					dropdownMenu.children(".item").filter(".hovered").length) {
					e.preventDefault();
					dropdownMenu.children(".item").filter(".hovered").first()[0].click();
				}
			});

			function itemsHoverEvent() {
				directItems.on("mouseenter."+uniqueId, function() {
					$(this).addClass("hovered")
				});

				directItems.on("mouseleave."+uniqueId, function() {
					$(this).removeClass("hovered")
				})
			}

			itemsHoverEvent();

			// Arrow key navigation support.
			$(document).on("keydown.c"+uniqueId, function(e) {
				if (!dropdownMenu.find(".dropdown.active").length &&
					(e.keyCode === 38 || e.keyCode === 40)) {
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

					$(document).on("mousemove.2"+uniqueId, function(e) {
						var $target = $(e.target);

						$(document).off("mousemove.2"+uniqueId);

						if ($target.closest(dropdown).length ||
							$target.closest(dropdownMenu).length) {
							if (!$target.closest(lfi).length) {
								lfi.removeClass("hovered");
								if ($target.closest(directItems)) {
									$target.closest(directItems).addClass("hovered");
								}
							}
							else { lfi.addClass("hovered") }
						}
						else if (options.hover) { dropdown.hideDropdown(options); }

						itemsHoverEvent();
					});
				}
			});

			if (keyboard) {
				directItems.first().addClass("hovered");
				directItems.off("mouseenter."+uniqueId+" mouseleave."+uniqueId);

				$(document).on("mousemove.1"+uniqueId, function(e) {
					var $target = $(e.target), lfi = directItems.first();

					$(document).off("mousemove.1"+uniqueId);

					if ($target.closest(dropdown).length ||
						$target.closest(dropdownMenu).length) {
						if (!$target.closest(lfi).length) {
							lfi.removeClass("hovered");
							if ($target.closest(directItems)) {
								$target.closest(directItems).addClass("hovered");
							}
						}
						else { lfi.addClass("hovered") }
					}
					else if (options.hover) { dropdown.hideDropdown(options); }

					itemsHoverEvent();
				});
			}

			dropdownMenu.removeClass("hidden").show().addClass("visible animating");

			$(window).on("resize." + uniqueId, function() {
				dropdownMenu.removeClass("upward downward right-side left-side")
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

				if (options.fluidMinWidth) {
					dropdownMenu.css("min-width", dropdown.outerWidth())
				}

				if (options.constrainWidth) {
					dropdownMenu.css({
						"max-width": dropdown.outerWidth(),
						"width": dropdown.outerWidth()
					})
				}

				if (options.view === "horizontal") {
					availTop = offsetTop + dropdownHeight;
					availBottom = windowHeight - offsetTop;

					if (offsetRight >= dropdownMenu.outerWidth()) {
						dropdownMenu.addClass("right-side")
					}
					else if (offsetLeft >= dropdownMenu.outerWidth()) {
						dropdownMenu.addClass("left-side")
					}
					else if (offsetRight >= offsetLeft) {
						dropdownMenu.addClass("right-side").css("max-width", offsetRight);
						dropdownMenuHeight = dropdownMenu.outerHeight()
					}
					else if (offsetLeft > offsetRight) {
						dropdownMenu.addClass("left-side").css("max-width", offsetLeft);
						dropdownMenuHeight = dropdownMenu.outerHeight()
					}

					if (options.browser) {
						if (dropdownMenu.hasClass("right-side")) {
							dropdownMenu.css("left", dropdownPosition.left + dropdown.outerWidth())
						}
						else if (dropdownMenu.hasClass("left-side")) {
							dropdownMenu.css({
								"left": dropdownPosition.left + dropdown.outerWidth()
							})
						}
					}
				}
				else if (overflowParent.length <= 0) {
					availTop = offsetTop;
					availBottom = windowHeight - offsetTop - dropdownHeight;
				}
				else {
					var offsetTopx = offsetTop -
						overflowParent.offset().top + $(window).scrollTop();

					availTop = offsetTopx;
					availBottom = overflowParent.get(0).clientHeight - offsetTopx - dropdownHeight
				}

				if (options.view === "vertical" && !dropdownMenu.hasClass("board")) {
					if (offsetRight + dropdown.outerWidth() >= dropdownMenu.outerWidth()) {
						dropdownMenu.addClass("right-side")
					}
					else if (offsetLeft + dropdown.outerWidth() >= dropdownMenu.outerWidth()) {
						dropdownMenu.addClass("left-side")
					}
					else if (offsetRight + dropdown.outerWidth() >=
						offsetLeft + dropdown.outerWidth()) {
						dropdownMenu.addClass("right-side")
							.css("max-width", offsetLeft + dropdown.outerWidth())
					}
					else if (offsetLeft + dropdown.outerWidth() >
						offsetRight + dropdown.outerWidth()) {
						dropdownMenu.addClass("left-side")
							.css("max-width", offsetRight + dropdown.outerWidth())
					}

					if (options.browser) {
						if (dropdownMenu.hasClass("right-side")) {
							dropdownMenu.css("left", dropdownPosition.left)
						}
						else if (dropdownMenu.hasClass("left-side")) {
							dropdownMenu.css({
								"left": dropdownPosition.left + dropdown.outerWidth() - dropdownMenu.outerWidth()
							})
						}
					}
				}

				availTop -= 5, availBottom -= 5;

				if (availBottom >= dropdownMenuHeight) {
					dropdownMenu.addClass("downward")
				}
				else if (availTop >= dropdownMenuHeight) {
					dropdownMenu.addClass("upward")
				}
				else {
					if (availBottom >= availTop) { dropdownMenu.addClass("downward") }
					else if (availTop + $(window).scrollTop() > dropdownMenuHeight) {
						dropdownMenu.addClass("upward");
					}
					else { dropdownMenu.addClass("downward") }
				}

				if (options.browser) {
					dropdownMenu.css("bottom", "auto");

					if (dropdownMenu.hasClass("downward")) {
						if (options.view === "vertical") {
							dropdownMenu.css({
								"top": dropdownPosition.top + dropdown.outerHeight()
							})
						}
						else if (options.view === "horizontal") {
							dropdownMenu.css("top", dropdownPosition.top)
						}
					}
					else if (dropdownMenu.hasClass("upward")) {
						if (options.view === "vertical") {
							dropdownMenu.css({
								"top": dropdownPosition.top - dropdownMenuHeight
							})
						}
						else if (options.view === "horizontal") {
							dropdownMenu.css({
								"top": dropdownPosition.top - dropdownMenuHeight + dropdownHeight
							})
						}
					}
				}
			});

			$(window).trigger("resize." + uniqueId);
			setTimeout(function() { dropdownMenu.removeClass("animating") }, options.inDuration);
		},

		hideDropdown: function(options, closeAll) {
			if (!$(this).hasClass("active")) { return }

			var
				dropdown = $(this),
				dropdownMenu =(options.browser) ? $(options.menuId) : dropdown.children(".drop.menu");
				items = dropdownMenu.find(".item").not(".xhover,.divider"),
				directItems = dropdownMenu.children(".item").not(".xhover,.divider"),
				uniqueId = dropdown.data("uniqueId")
			;

			$(window).off("resize." + uniqueId);
			$(document).off("keydown.a"+uniqueId+" keydown.b"+uniqueId+" keydown.c"+uniqueId+" keyup."+uniqueId+" click."+uniqueId+" mousemove.2"+uniqueId);
			directItems
				.off("mouseenter." + uniqueId + " mouseleave."+uniqueId)
				.removeClass("hovered");
			dropdownMenu.find(".dropdown").filter(".active").each(function() {
				$(this).hideDropdown($(this).data("options"));
			});
			directItems.removeClass("hovered");
			dropdown.removeClass("active");
			dropdownMenu.removeClass("visible").addClass("animating");
			setTimeout(function() {
				dropdownMenu.hide().addClass("hidden")
					.removeClass("upward downward right-side left-side animating")
			}, options.outDuration);

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
						menuTrigger.hideDropdown(menuTrigger.data("options"), true)
					})
				}

				dropdown.parents(".dropdown").each(function() {
					$(this).hideDropdown($(this).data("options"), true);
				});
			}
		}
	});

	$(document).ready(function() { $(".dropdown").dropdown() });

}(jQuery));
