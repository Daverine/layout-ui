/*!
* emmandave UI scrollPin
* Copyright 2016-2017 David A.
*/

(function($) {
	$.fn.scrollPin = function(options) {
		var 
			defaults = {
				className: "pinned",
				parentGuide: false,
				forceVisible: false,
				topSpacing: 0,
				bottomSpacing: 0,
				zIndex: 9999,
				onPin: undefined,
				onUnpin: undefined
			},
			uniqueid = (Math.random() + 1).toString(36).substring(2, 7),
			options = $.extend({}, defaults, options)
		;

		return this.each(function(index) {
			var 
				$element = $(this),
				elemProp = {style: $element.attr("style")},
				$parent = $element.parent()
			;
			
			// update function
			function update() {
				$element.attr("style", "");
				elemProp.offset = $element.offset();
				elemProp.height = $element.outerHeight();
				elemProp.marginL = (parseInt($element.css("marginLeft"), 10) || 0);
				elemProp.marginT = (parseInt($element.css("marginTop"), 10) || 0);
				
				// adjust offset with margins
				elemProp.offset.left -= elemProp.marginL;
				elemProp.offset.top -= elemProp.marginT;

				// needed if pinned element needs to be contained inside the parent element"s boundaries
				if (options.parentGuide) {
					var
						parent_height = $parent.height(),
						parent_offset = $parent.offset()
					;
				}

				if (options.forceVisible) {
					$element.css({
						"position": "fixed",
						"left": elemProp.offset.left,
						"top": elemProp.offset.top,
						"zIndex": options.zIndex
					}).addClass(options.className);
				}
				else {
					$element.css({
						"zIndex": options.zIndex
					}).removeClass(options.className);

					options.uniqueid = ".pin_" + uniqueid + "_" + index;
				
					// off a previously set callback function (if any) and re-on the scroll.options.uniqueid event
					$(window).off("scroll."+options.uniqueid).on("scroll."+options.uniqueid, function() {
						var scroll = $(window).scrollTop();

						if (
							scroll >= (elemProp.offset.top - options.topSpacing) &&
							(!options.parentGuide || (scroll <= parent_offset.top + parent_height - elemProp.height - options.bottomSpacing)) &&
							$element.css("position") != "fixed"
						) {
							$element.css({
								"position": "fixed",
								"top": options.topSpacing,
								"left": elemProp.offset.left
							}).addClass(options.className);
							
							if (options.onPin && typeof options.onPin == "function") {
								options.onPin($element);
							}
						}
						else if (
							scroll < (elemProp.offset.top - options.topSpacing) &&
							$element.css("position") != "absolute"
						) {
							$element.css({
								"position": "absolute",
								"left": elemProp.offset.left,
								"top": elemProp.offset.top
							}).removeClass(options.className);
							
							if (options.onUnpin && typeof options.onUnpin == "function") {
								options.onUnpin($element);
							}
						}
						else if (
							options.parentGuide &&
							scroll >= (parent_offset.top + parent_height - elemProp.height - options.bottomSpacing) &&
							$element.css("position") != "absolute"
						) {
							$element.css({
								"position": "absolute", 
								"top": parent_offset.top + parent_height - elemProp.height - options.bottomSpacing,
								"left": elemProp.offset.left
							}).removeClass(options.className);
							
							if (options.onUnpin && typeof options.onUnpin == "function") {
								options.onUnpin($element);
							}
						}
					});
				}

				// trigger the scroll event so that computations take effect
				$(window).trigger("scroll." + options.uniqueid); 
			}

			// update elements" position
			update();

			// on window resize update elements" position
			$(window).on("resize.scrollPin", function() {
				update();
			});
		});
	}
}(jQuery));