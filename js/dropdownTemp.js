$(document).on("touchstart.dd mousedown.dd", function(e) {
	if ($(e.target).closest(".dropdown:not([data-findTrigger]):not([data-hover]):not(.sub), .dropdown.sub[data-hover='false']:not([data-findTrigger]), " +
	".dropdown[data-findTrigger]:not([data-hover]):not(.sub) > .trigger, .dropdown.sub[data-hover='false'][data-findTrigger] > .trigger").length) {
		ddTemp.targetCapture = $(e.target).closest(".dropdown:not([data-findTrigger]):not([data-hover]):not(.sub), .dropdown.sub[data-hover='false']:not([data-findTrigger]), " +
			".dropdown[data-findTrigger]:not([data-hover]):not(.sub) > .trigger, .dropdown.sub[data-hover='false'][data-findTrigger] > .trigger");
		ddTemp.csCoord = e.type.indexOf("touch") > -1 ? e.originalEvent.touches[0].clientX : e.clientX;

		$(document).on("touchmove.dd mousemove.dd", ddGestureMove);
		$(document).on("touchend.dd mouseup.dd", ddGestureEnd);
	}
	else if ($(e.target).closest(".dropdown[data-hover]:not([data-findTrigger]), .dropdown.sub:not([data-hover=false]):not([data-findTrigger]), "+
	".dropdown[data-hover][data-findTrigger] > .trigger, .dropdown.sub:not([data-hover=false])[data-findTrigger] > .trigger").length && e.type.indexOf("touch") > -1) {
		ddTemp.targetCapture = $(e.target).closest(".dropdown[data-hover]:not([data-findTrigger]), .dropdown.sub:not([data-hover=false]):not([data-findTrigger]), "+
		".dropdown[data-hover][data-findTrigger] > .trigger, .dropdown.sub:not([data-hover=false])[data-findTrigger] > .trigger").data("touchHover", true);
		ddTemp.csCoord = e.originalEvent.touches[0].clientX;

		$(document).on("touchmove.dd mousemove.dd", ddGestureMove);
		$(document).on("touchend.dd mouseup.dd", ddGestureEnd);
	}
});

function ddGestureMove(e) {
	ddTemp.ceCoord = e.type.indexOf("touch") > -1 ? e.originalEvent.touches[0].clientX : e.clientX;
	if (Math.abs(ddTemp.ceCoord - ddTemp.csCoord) > 5) {
		ddTemp.targetCapture.data("touchHover", false);
		ddTemp.targetCapture = false;
	}
}

function ddGestureEnd(e) {
	$(document).off("touchmove.dd mousemove.dd touchend.dd mouseup.dd");
	if (ddTemp.targetCapture !== false) {
		if (ddTemp.targetCapture.data("touchHover") && ddTemp.targetCapture.closest(".dropdown").hasClass("active")) {
			ddTemp.targetCapture.closest(".dropdown").trigger("mouseleave");
			return;
		}
		
		$(ddTemp.targetCapture).dropdownInit(e);
		ddTemp.targetCapture = false;
	}
}


// Updated code

$(document).on("touchstart.dd mousedown.dd", function(e) {
	if ($(e.target).closest(".dropdown").is(".dropdown:not([data-findTrigger]):not([data-hover]):not(.sub)") ||
		$(e.target).closest(".dropdown").is(".dropdown.sub[data-hover='false']:not([data-findTrigger])") ||
		$(e.target).closest(".trigger").filter(function() { return $(this).parent(".dropdown[data-findTrigger]:not([data-hover]):not(.sub)").length || $(this).parent(".dropdown.sub[data-hover='false'][data-findTrigger]").length}).length
	) {
		ddTemp.targetCapture = $(e.target).closest(".dropdown:not([data-findTrigger]):not([data-hover]):not(.sub), .dropdown.sub[data-hover='false']:not([data-findTrigger]), " +
			".dropdown[data-findTrigger]:not([data-hover]):not(.sub) > .trigger, .dropdown.sub[data-hover='false'][data-findTrigger] > .trigger");
		ddTemp.csCoord = e.type.indexOf("touch") > -1 ? e.originalEvent.touches[0].clientX : e.clientX;

		$(document).on("touchmove.dd mousemove.dd", ddGestureMove);
		$(document).on("touchend.dd mouseup.dd", ddGestureEnd);
	}
	else if ($(e.target).closest(".dropdown[data-hover]:not([data-findTrigger]), .dropdown.sub:not([data-hover=false]):not([data-findTrigger]), "+
	".dropdown[data-hover][data-findTrigger] > .trigger, .dropdown.sub:not([data-hover=false])[data-findTrigger] > .trigger").length && e.type.indexOf("touch") > -1) {
		ddTemp.targetCapture = $(e.target).closest(".dropdown[data-hover]:not([data-findTrigger]), .dropdown.sub:not([data-hover=false]):not([data-findTrigger]), "+
			".dropdown[data-hover][data-findTrigger] > .trigger, .dropdown.sub:not([data-hover=false])[data-findTrigger] > .trigger").data({hoverTouchSupport: true, touchHover: true});
		ddTemp.csCoord = e.originalEvent.touches[0].clientX;

		$(document).on("touchmove.dd mousemove.dd", ddGestureMove);
		$(document).on("touchend.dd mouseup.dd", ddGestureEnd);
	}
});

function ddGestureMove(e) {
	ddTemp.ceCoord = e.type.indexOf("touch") > -1 ? e.originalEvent.touches[0].clientX : e.clientX;
	if (Math.abs(ddTemp.ceCoord - ddTemp.csCoord) > 5) {
		ddTemp.targetCapture.data("touchHover", false);
		ddTemp.targetCapture = false;
	}
}

function ddGestureEnd(e) {
	$(document).off("touchmove.dd mousemove.dd touchend.dd mouseup.dd");
	if (ddTemp.targetCapture !== false) {
		if (ddTemp.targetCapture.data("touchHover") && ddTemp.targetCapture.closest(".dropdown").hasClass("active")) {
			ddTemp.targetCapture.data("touchHover", false);
			ddTemp.targetCapture.closest(".dropdown").trigger("mouseout", [true]);
			return;
		}
		
		if (ddTemp.targetCapture.data("hoverTouchSupport")) {
			ddTemp.targetCapture.trigger("mouseenter");
			return;
		}

		$(ddTemp.targetCapture).dropdownInit(e);
		ddTemp.targetCapture = false;
	}
}