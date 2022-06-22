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

	function isElementInView(element, viewport) {
		if (!element.length) { return false }
		var 
			pageTop = $(window).scrollTop(),
			pageLeft = $(window).scrollLeft(),
			pageBottom = pageTop + $(window).height(),
			pageRight = pageLeft + $(window).width(),
			elementTop = $(element).offset().top,
			elementLeft = $(element).offset().left,
			elementBottom = elementTop + $(element).height(),
			elementRight = elementLeft + $(element).width()
		;

		pageTop += viewport.top;
		pageLeft += viewport.left;
		pageBottom = pageBottom - viewport.bottom - viewport.top;
		pageRight = pageRight - viewport.right - viewport.left;

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
	}

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

	$.fn.scrollspy = function(options) {
		this.each(function() {
			var
				settings = $.extend({}, {
					namespace: "scrollspy",
					viewport: {
						top: 100,
						left: 0,
						right: 0,
						bottom: 60
					},
					duration: 400
				}, options),
				$this = $(this),
				$active
			;

			$active = $this.find(".item[href], .item[data-target]").filter(function() {
				var element = $($(this).attr("href")) || $("#" + $(this).data("target"));
				if (isElementInView(element, settings.viewport)) {
					return true;
				}
			});

			if ($active.length) { $active.first().addClass("active").siblings().removeClass("active"); }

			$this.click(function(e) {
				var target = $(e.target), element, node;

				if (target.closest(".item[href], item[data-target]").length) {
					e.preventDefault();
					element = target.closest(".item[href], .item[data-target]")

					node = $(element.attr("href") || "#" + element.data("target"));

					if (node.length) {
						$("html, body").animate({
							scrollTop: (node.offset().top - settings.viewport.top)
						}, {
							duration: settings.duration,
							queue: false,
							complete: function() { unawareLocationHash(node.attr("id")); }
						});
					}
				}
			});

			$(window).on("scroll."+settings.namespace, function() {
				var elements = $this.find(".item[href], .item[data-target]").filter(function() {
					var element = $($(this).attr("href") || "#" + $(this).data("target"));
					if (isElementInView(element, settings.viewport)) { return true; }
				});

				elements.first().addClass("active").siblings().removeClass("active");
			});
		});
	}

	$(document).ready(function() { $(".scrollspy").scrollspy() });

}(jQuery, window, document));