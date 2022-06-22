/*!
* emmandave UI scrollPin
* Copyright 2016-2017 David A.
*/

(function($, window) {

	"use strict";

	window = (typeof window != "undefined" && window.Math == Math)
		? window
		: (typeof self != "undefined" && self.Math == Math)
			? self
			: Function('return this')()
	;

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

	$.fn.scrollPin = function(options) {
		var 
			defaults = {
				className: "pinned",
				parentGuide: false,
				stiky: false,
				forceVisible: false,
				topSpacing: 0,
				bottomSpacing: 0,
				zIndex: 9999,
				pinned: undefined,
				unpinned: undefined
			},
			uniqueid = (Math.random() + 1).toString(36).substring(2, 7),
			options = $.extend({}, defaults, options)
		;

		return this.each(function(index) {
			var 
				$element = $(this),
				elemProp = {style: $element.attr("style")},
				settings = strObj4rmDOM($element.data("options"))
			;
			
			settings = ($.isPlainObject(settings))
				? $.extend(options, settings)
				: options
			;

			// update function
			function update() {
				$element.attr("style", "");
				elemProp.position = $element.position();
				elemProp.offset = $element.offset();
				elemProp.height = $element.outerHeight();
				elemProp.width = $element.outerWidth();
				elemProp.marginL = (parseInt($element.css("marginLeft"), 10) || 0);
				elemProp.marginT = (parseInt($element.css("marginTop"), 10) || 0);
				
				// adjust offset with margins
				elemProp.offset.left -= elemProp.marginL;
				elemProp.offset.top -= elemProp.marginT;

				// needed if pinned element needs to be contained inside the parent element"s boundaries
				if (settings.parentGuide) {
					var
						$parent = $element.parent(),
						parent_height = $parent.height(),
						parent_offset = $parent.offset()
					;
				}

				var lastScroll = $(window).scrollTop();

				if (settings.forceVisible) {
					$element.css({
						"position": "fixed",
						"left": elemProp.offset.left,
						"top": elemProp.offset.top,
						"zIndex": settings.zIndex
					}).addClass(settings.className);
					// fix for the width of relative width on the element
					$element[0].style.setProperty("width", elemProp.width + "px", "important");
				}
				else {
					$element.css({
						"zIndex": settings.zIndex
					}).removeClass(settings.className);

					settings.uniqueid = ".pin_" + uniqueid + "_" + index;

					// off a previously set callback function (if any) and re-on the scroll.settings.uniqueid event
					$(window).off("scroll."+settings.uniqueid).on("scroll."+settings.uniqueid, function() {
						var scroll = $(window).scrollTop();
						if (
							(!(settings.stiky && settings.parentGuide) || (scroll >= lastScroll)) &&
							scroll >= (elemProp.offset.top - settings.topSpacing) &&
							(!settings.parentGuide || (scroll <= parent_offset.top + parent_height - elemProp.height - settings.bottomSpacing)) &&
							$element.css("position") != "fixed"
						) {
							$element.css({
								"position": "fixed",
								"top": settings.topSpacing,
								"left": elemProp.offset.left
							}).addClass(settings.className);
							// fix for the use of relative width on the element.
							$element[0].style.setProperty("width", elemProp.width + "px", "important");
							lastScroll = scroll;

							if (settings.pinned && typeof settings.pinned == "function") {
								settings.pinned($element);
							}
						}
						else if (
							((settings.stiky && settings.parentGuide) && scroll < lastScroll) &&
							(parent_offset.top + parent_height >= scroll + $(window).height()) &&
							(scroll + $(window).height() >= parent_offset.top + elemProp.height + settings.topSpacing &&
							$element.css("position") != "fixed")
						) {
							$element.css({
								"position": "fixed",
								"top": $(window).height() - elemProp.height - settings.bottomSpacing,
								"left": elemProp.offset.left
							}).addClass(settings.className);
							// fix for the use of relative width on the element.
							$element[0].style.setProperty("width", elemProp.width + "px", "important");
							lastScroll = scroll;

							if (settings.pinned && typeof settings.pinned == "function") {
								settings.pinned($element);
							}
						}
						else if (
							settings.parentGuide &&
							(scroll > parent_offset.top + $parent.outerHeight() - elemProp.height - settings.topSpacing - settings.bottomSpacing - parseFloat($parent.css("padding-bottom"))) &&
							$element.css("position") != "absolute"
						) {
							$element.css({
								"position": "absolute", 
								"top": elemProp.position.top + parent_height - elemProp.height - settings.bottomSpacing,
								"left": elemProp.position.left
							}).removeClass(settings.className);
							// fix for the use of relative width on the element.
							$element[0].style.setProperty("width", elemProp.width + "px", "important");
							lastScroll = scroll;

							if (settings.unpinned && typeof settings.unpinned == "function") {
								settings.unpinned($element);
							}
						}
						else if (
							scroll < (elemProp.offset.top - settings.topSpacing) &&
							(!(settings.stiky && settings.parentGuide) ||
								(
									!(parent_offset.top + parent_height >= scroll + $(window).height()) ||
									(elemProp.height + settings.topSpacing + settings.bottomSpacing + parseFloat($parent.css("padding-top")) >= $(window).height() - (parent_offset.top - scroll))
								)
							) &&
							$element.css("position") != "absolute"
						) {
							$element.css({
								"position": "absolute",
								"left": elemProp.position.left,
								"top": elemProp.position.top,
							}).removeClass(settings.className);
							// fix for the use of relative width on the element.
							$element[0].style.setProperty("width", elemProp.width + "px", "important");
							lastScroll = scroll;

							if (settings.unpinned && typeof settings.unpinned == "function") {
								settings.unpinned($element);
							}
						}
					});
				}

				// trigger the scroll event so that computations take effect
				$(window).trigger("scroll." + settings.uniqueid); 
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
}(jQuery));