/*!
* Emmadave UI Modal
* Copyright 2016-2017 Folorunso David A.
*/

;(function($, window, document, undefined) {

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

				id = uniqueid(settings.namespace);
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
})(jQuery);