/*!
* Emmandave UI sidebar
* Copyright 2016-2017 Folorunso David A.
*/

(function($) {

	$.fn.extend({
		sidebar: function(options) {
			this.each(function() {
				var
					$this = $(this),
					sidebarId = $this.attr("href") || "#"+$(this).data("target"),
					sidebar = $(sidebarId)
				;

				sidebar.find(".close").click(function() { sidebar.closeSidebar(options) });

				$this.click(function(e) {
					e.preventDefault();
					
					if (!sidebar.hasClass("active")) { sidebar.openSidebar(options, $this) }
					else if (sidebar.hasClass("active")) { sidebar.closeSidebar(options) }
				})
			})
		},

		openSidebar: function(options, trigger) {
			if ($(this).hasClass("active")) { return }

			var
				$this = $(this),
				options = $.extend({
					pluginName: "sidebar", lockClass: "sidebar-lock", dismissible: true,
					scrollLock: false, returnScroll: true, inDuration: 500
				}, options)
			;

			$this.addClass("active");

			if (options.returnScroll) { $this.data("scrollPos", $("body").scrollTop()) }

			if (options.scrollLock) { $this.data("unlockInfo", lockScreen(options.lockClass)) }

			if (options.dismissible) {
				$(document).on("click."+options.pluginName, function(e) {
					var target = $(e.target);

					if (!$target.closest($this).length && !$target.closest(trigger).length) {
						$this.closeSidebar(options)
					}
				})
			}

			$this.addClass("animating");
			setTimeout(function() { $this.removeClass("animating") }, options.inDuration);
		},

		closeSidebar: function(options) {
			if (!$(this).hasClass("active")) { return }

			var
				$this = $(this),
				options = $.extend({
					pluginName: "sidebar", scrollLock: false, returnScroll: true, outDuration: 500
				}, options),
				unlockInfo = $this.data("unlockInfo"), scrollPos = $this.data("scrollPos")
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

}(jQuery));