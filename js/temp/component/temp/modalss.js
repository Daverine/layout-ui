/*!
* Emmadave UI Modal
* Copyright 2016-2017 Folorunso David A.
*/

(function($) {
	
	$.fn.extend({
		openModal: function(options) {
			var
				defaults = {
					pluginName: "modal", lockClass: "modal-lock", overlayClass: "modal-overlay",
					closeOnEsc: true, closeOnOverlayClick: true, closeOnCancel: true,
					inDuration: 500, ready: undefined, autoOpen: false
				},
				modal = $(this), options = $.extend(defaults, options)
			;

			if (modal.hasClass("active")) { return }

			modal.addClass("active");
			modal.data("uniqueid", uniqueId(options.pluginName));

			var uniqueid = modal.data("uniqueid");

			modal.wrap("<div class='" + options.overlayClass + "'>");
			modal.data("unlockInfo", lockScreen(options.lockClass));
			overlay = modal.parent("." + options.overlayClass).attr("tabindex", -1).scrollTop(0);

			if (modal.hasClass("back-blur")) { options.blurring = true }

			if (options.closeOnOverlayClick && !modal.hasClass("full-screen")) {
				overlay.click(function(e) {
					var $target = $(e.target);
			
					if (!$target.closest(modal).length) { modal.closeModal(options) }
				})
			}

			if (options.closeOnEsc) {
				overlay.keyup(function(e) { if (e.keyCode === 27) { modal.closeModal(options) } })
			}

			modal.find(".close").click(function() { modal.closeModal(options) });

			if (options.blurring) {
				if ($("body").hasClass("modal-blur")) { modal.data("preBlured", true) }
				else { $("body").addClass("modal-blur") }
			}

			$(window).on("onSelectAll." + uniqueid, function(e) {
				e.parentEvent.preventDefault();

				var selectionElement = modal[0], range, selection;

				if (document.body.createTextRange) {
					range = document.body.createTextRange();
					range.moveToElementText(selectionElement);
					range.select()
				}
				else if (window.getSelection) {
					selection = window.getSelection();
					range = document.createRange();
					range.selectNodeContents(selectionElement);
					selection.removeAllRanges();
					selection.addRange(range)
				}
			});

			overlay.keydown(function(e) {
				var modalFocusableElements = $(":focusable", $(this));

				if (modalFocusableElements.filter(":last").is(":focus") && (!e.shiftKey && e.keyCode === 9)) {
					e.preventDefault();
					modalFocusableElements.filter(":first").focus()
				}
				else if (modalFocusableElements.filter(":first").is(":focus") && (e.shiftKey && e.keyCode === 9)) {
					e.preventDefault();
					modalFocusableElements.filter(":last").focus()
				}
			});

			if (modal.hasClass("self-scroll")) {
				overlay.css("display", "flex");
				modal.css("margin", "0")
			}
			else { overlay.show() }

			overlay.css({opacity: 0.7}).animate({opacity: 1}, {
				duration: options.inDuration, queue: false
			});
			modal.addClass("animating").show();
			setTimeout(function() {
				modal.removeClass("animating");
				if (typeof(options.ready)==="function") { options.ready() }
				overlay.focus();
				modal.data("modal-options", options)
			}, options.inDuration)
		},

		closeModal: function(options) {
			var
				defaults = { outDuration: 500, complete: undefined },
				modal = $(this), uniqueid = modal.data("uniqueid")
			;
			
			if (!modal.hasClass("active")) { return }
			
			modal.removeClass("active");
			options = $.extend(defaults, options);
			overlay.css("overflow", "hidden");
			$(window).off("onSelectAll." + uniqueid);

			if (modal.hasClass("back-blur")) { options.blurring = true }

			if (options.blurring && !options.preBlured) { $("body").removeClass("modal-blur") }

			overlay.animate({opacity: 0}, { duration: options.out_duration, queue: false });
			modal.addClass("animating");
			setTimeout(function() {
				unlockScreen(modal.data("unlockInfo"));
				modal.removeClass("animating").css("margin", "").hide().unwrap();

				if (typeof(options.complete) === "function") { options.complete() }
				if (options.lastFocus != undefined) { options.lastFocus.focus() }
			}, options.outDuration)
		},
		
		modal: function(options) {
			this.each(function() {
				var
					$this = $(this),
					modalID = $(this).attr("href") || "#" + $(this).data("target"), modal = $(modalID)
				;

				options = options || {};

				$this.click(function() {
					options.lastFocus = $this;
					modal.openModal(options)
				})
			})
		}
	});

	$(document).ready(function() { $(".modal-trigger").modal() })

})(jQuery);