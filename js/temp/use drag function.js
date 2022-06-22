var
					dragStarted = false, initialX, initialY, xOffset = 0, yOffset = 0
				;

				lightbox[0].addEventListener("touchstart", dragStart, false);
				lightbox[0].addEventListener("touchend", dragEnd, false);
				lightbox[0].addEventListener("touchmove", drag, false);

				lightbox[0].addEventListener("mousedown", dragStart, false);
				lightbox[0].addEventListener("mouseup", dragEnd, false);
				lightbox[0].addEventListener("mousemove", drag, false);

				function dragStart(e) {
					if (e.type === "touchstart") {
						initialX = e.touches[0].clientX - xOffset;
						initialY = e.touches[0].clientY - yOffset;
					}
					else {
						initialX = e.clientX - xOffset;
						initialY = e.clientY - yOffset;
					}

					if (e.target === image[0]) {
						dragStarted = true;
					}
				}

				function dragEnd(e) {
					dragStarted = false;
					var
						reAdjusted = false,
						constX = ($(window).width() - mDialog.width())/2,
						constY = ($(window).height() - mDialog.height())/2,
						nConstX = -(constX), nConstY = -(constY)
					;

					if (xOffset > constX) { xOffset = constX; reAdjusted = true; }
					else if (xOffset < nConstX) { xOffset = nConstX; reAdjusted = true; }
					
					if (yOffset > constY) { yOffset = constY; reAdjusted = true; }
					else if (yOffset < nConstY) { yOffset = nConstY; reAdjusted = true; }

					if (reAdjusted) {
						mDialog.velocity({left: xOffset, top: yOffset}, {duration: 300, easing: "easeOutExpo"});
					}
					
					initialX = xOffset;
					initialY = yOffset;
				}

				function drag(e) {
					if (dragStarted) {
						e.preventDefault();

						if (e.type === "touchmove") {
							xOffset = e.touches[0].clientX - initialX;
							yOffset = e.touches[0].clientY - initialY;
						}
						else {
							xOffset = e.clientX - initialX;
							yOffset = e.clientY - initialY;
						}

						mDialog.css({left: xOffset, top: yOffset});
					}
				}