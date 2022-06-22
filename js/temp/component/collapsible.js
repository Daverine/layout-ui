/*!
* emmandave UI Collapsible
* Copyright 2016-2017 Folorunso David A.
*/

(function($) {

	$.fn.collapsible = function(options) {
		this.each(function() {
			var
				defaults = {
					duration: 300, accordion: false, allClosable: true, scrollToView: true
				},
				options = $.extend(defaults, options), $this = $(this),
				titleClass = ".c-toggler", $titles = $this.find(titleClass)
			;

			function scrollToview($this) {
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
						if (options.scrollToView && xPre) { scrollToview($elem) }
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

}(jQuery));
