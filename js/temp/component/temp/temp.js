
	$(document).ready(function() {
		
		$(document).click(function(e) {
			alert("Yess");
			return;
			if ($target.closest(".dropdown:not([data-findTrigger]):not([data-hover])").length) {
				$target.closest(".dropdown:not([data-findTrigger]):not([data-hover])").dropdownInit();
			} else if ($target.closest(".dropdown:not([data-findTrigger]):not(.sub)").length) {
				$target.closest(".dropdown:not([data-findTrigger]):not(.sub)").dropdownInit();
			} else if ($target.closest(".dropdown.sub[data-hover=false]:not([data-hoverfindTrigger])").length) {
				$target.closest(".dropdown.sub[data-hover=false]:not([data-findTrigger])").dropdownInit();
			} else if ($target.closest(".dropdown[data-findTrigger]:not([data-hover]) > .trigger").length) {
				$target.closest(".dropdown[data-findTrigger]:not([data-hover]) > .trigger").dropdownInit();
			} else if ($target.closest(".dropdown[data-findTrigger]:not(.sub) > .trigger").length) {
				$target.closest(".dropdown[data-findTrigger]:not(.sub) > .trigger").dropdownInit();
			} else if ($target.closest(".dropdown.sub[data-hover=false][data-findTrigger] > .trigger").length) {
				$target.closest(".dropdown.sub[data-hover=false][data-findTrigger] > .trigger").dropdownInit();
			} else { return false; }
		});
	});

	$(document).on("click.dd", ".dropdown:not([data-findTrigger]):not([data-hover]), .dropdown:not([data-findTrigger]):not(.sub), .dropdown.sub[data-hover=false]:not([data-hoverfindTrigger])" +
		".dropdown[data-findTrigger]:not([data-hover]) > .trigger, .dropdown[data-findTrigger]:not(.sub) > .trigger, .dropdown.sub[data-hover=false][data-findTrigger] > .trigger", function () {
		$(this).dropdownInit();
	});

	$(document).on("mouseenter.dropdown",
		"dropdown[data-hover]:not([data-findTrigger]), dropdown.sub:not([data-findTrigger]):not([data-hover=false])," +
		" dropdown[data-hover][data-findTrigger] > .trigger, dropdown.sub[data-findTrigger]:not([data-hover=false]) > .trigger", function(e) {
		
	});

	$(document).on("mouseenter.dropdown",
		"dropdown[data-hover]:not([data-findTrigger]), dropdown.sub:not([data-findTrigger]):not([data-hover=false])," +
		" dropdown[data-hover][data-findTrigger] > .trigger, dropdown.sub[data-findTrigger]:not([data-hover=false]) > .trigger",
		function() {
			var dropdown = ($(this).hasClass("trigger"))
					? $(this).closest($(".dropdown"))
					: $(this)
				, timeDelay = dropdown.data("settings").delay || 250
			;

			clearTimeout(showDelayTimer);

			hideDelayTimer = setTimeout(function() {
				dropdown.hideDropdown(dropdown.data("settings"));
			}, timeDelay);

			if (!dropdown.hasClass("active")) { clearTimeout(hideDelayTimer) }
	});




	if (settings.page) {
		var  cord = {
			original: settings.e,
			left: e.pageX,
			right: $(window).width() - cord.left,
			top: e.pageY,
			bottom: $(window).height() - cord.top
		};

		dropdownMenu.css({"right": "auto", "bottom": "auto"});

		if (cord.right >= dropdownMenu.outerWidth()) {
			dropdownMenu.css("left", cord.left);
		}
		else if (cord.left >= dropdownMenu.outerWidth()) {
			dropdownMenu.css("left", cord.left - dropdownMenu.outerWidth());
		}
		else if (cord.right >= cord.left) {
			if (cord.right + cord.left >= dropdownMenu.outerWidth()) {
				dropdownMenu.css("left", $(window).width() - dropdownMenu.outerWidth());
			}
			else {
				dropdownMenu.css({"left": 0, "max-width": $(window).width()});
			}
		}
		else {
			if (cord.right + cord.left >= dropdownMenu.outerWidth()) {
				dropdownMenu.css("left", 0);
			}
			else {
				dropdownMenu.css({"left": 0, "max-width": $(window).width()});
			}
		}

		if (cord.bottom >= dropdownMenu.outerHeight()) {
			dropdownMenu.css("top", cord.top);
		}
		else if (cord.top >= dropdownMenu.outerHeight()) {
			dropdownMenu.css("top", cord.top - dropdownMenu.outerHeight());
		}
		else if (cord.bottom >= cord.top) {
			if (cord.bottom + cord.top >= dropdownMenu.outerHeight()) {
				dropdownMenu.css("top", $(window).height() - dropdownMenu.outerHeight());
			}
			else {
				dropdownMenu.css({"top": 0, "max-height": $(window).width()});
			}
		}
		else {
			if (cord.bottom + cord.top >= dropdownMenu.outerHeight()) {
				dropdownMenu.css("top", 0);
			}
			else {
				dropdownMenu.css({"top": 0, "max-height": $(window).height()});
			}
		}
	}
