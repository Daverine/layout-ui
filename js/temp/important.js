	// Change the Hash location of your browser without refreshing the browser.

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

	// Check if a particular element is in viewport presently

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

/* tell if the key pressed is a character key or not */
document.addEventListener('keyup', event => {
	if (String.fromCharCode(event.keyCode).match(/(\w|\s)/g)) {
		//pressed key is a char
	} else {
		//pressed key is a non-char
		//e.g. 'esc', 'backspace', 'up arrow'
	}
});