var
	getOP = dropdownMenu.parents().not("body").filter(function() {
		return (this.css("overflow-y") == "auto" || this.css("overflow-y") == "scroll")
	}).first(),
	op = getOP.length ? overflowParent : $("html"),
	aOp = getOP.length ? overflowParent : $(window),
	opProp = {
		height: aOp.height(),
		width: aOp.width(),
		top: op.offset().top,
		left: op.Offset().left,
		tScroll: op.scrollTop(),
		lScroll: op.scrollLeft()
	},
	dProp = {
		height: dropdown.outerHeight(),
		width: dropdown.outerWdith(),
		top: dropdown.offset().top - $(window).scrollTop() - opProp.top + opProp.tScroll,
		left: dropdown.offset().left - $(window).scrollTop() - opProp.left + opProp.lScroll,
		position: dropdown.position()
	},
	dmProp = {}, spacing = {},
;

if (settings.fluidMinWidth) {
	dropdownMenu.css("min-width", dropdownMenu.outerWidth());
}

if (settings.constrainWidth) {
	dropdownMenu.css({
		"max-width": dropdown.outerWidth(),
		"width": dropdown.outerWidth()
	});
}

dmProp.height = dropdownMenu.outerHeight(true);
dmProp.width = dropdownMenu.outerWidth(true);

if (settings.view == "horizontal") {
	spacing.top = dProp.top - opProp.tScroll + dProp.height;
	spacing.bottom = opProp.height - dProp.top + opProp.tScroll;
	spacing.left = dProp.left - opProp.lScroll;
	spacing.right = opProp.width - spacing.left - dProp.width;	
}
else {
	spacing.top = dProp.top - opProp.tScroll;
	spacing.bottom = opHeight - spacing.top - dProp.height;
	spacing.left = dProp.left - opProp.lScroll + dProp.width;
	spacing.right = opProp.width - dProp.left + opProp.lScroll;
}

if (!dropdownMenu.hasClass("board")) {
	if (spacing.right >= dmProp.width || spacing.right >= spacing.left) {
		dropdownMenu.addClass("rhs");
	}
	else if (spacing.left >= dmProp.width) {
		dropdownMenu.addClass("lhs");
	}
}

spacing.top -=5;
spacing.bottom -=5;

if (spacing.top >= dmProp.height) {
	dropdownMenu.addClass("downward");
}
else if (spacing.bottom >= dmProp.height) {
	dropdownMenu.addClass("upward");
}
else if (spacing.top > spacing.bottom && spacing.top + aOp.scrollTop() > dProp.height) {
	dropdownMenu.addClass("upward");
	setTimeout(function() {
		op.animate(
			{ scrollTop: dropdownMenu.offset().top - $(window).scrollTop() - opProp.top + opProp.tScroll - 20 },
			{ duration: settings.duration/2 }
		);
	}, settings.duration);
}
else {
	dropdownMenu.addClass("downward");
	setTimeout(function() {
		op.animate(
			{ scrollTop: dropdownMenu.offset().top - $(window).scrollTop() - opProp.top + opProp.tScroll + dmProp.height + 20 },
			{ duration: settings.duration/2 }
		);
	}, settings.duration);
}

if (settings.browser) {
	dropdownMenu.css({
		"right": "auto",
		"bottom": "auto"
	});

	if (settings.view == "horizontal") {
		if (dropdownMenu.hasClass("rhs")) {
			dropdownMenu.css("left", dProp.position.left + dProp.width);
		}
		else {
			dropdownMenu.css("left", dProp.position.left - dmProp.width);
		}

		if (dropdownMenu.hasClass("downward")) {
			dropdownMenu.css("top", dProp.position.top)
		}
		else {
			dropdownMenu.css("top", dProp.position.top - dmProp.height + dProp.height);
		}
	}
	else {
		if (dropdownMenu.hasClass("rhs")) {
			dropdownMenu.css("left", dProp.position.left)
		}
		else {
			dropdownMenu.css("left", dProp.position.left + dProp.width - dmProp.width);
		}

		if (dropdownMenu.hasClass("downward")) {
			dropdownMenu.css("top", dProp.position.top + dProp.height);
		}
		else {
			dropdownMenu.css("top", dProp.position.top - dmProp.height);
		}
	}
}