/*!
* Emmandave UI tabs
* Copyright 2016-2017 Folorunso David A.
*/

(function ($) {

	$.fn.tabs = function() {
		this.each(function() {
			var
				$this = $(this), $items = $this.find(".item[href], .item[data-target]"),
				$index, $active, $content
			;

			$active = $($items.filter("[href='" + location.hash + "']")).length
				? $($items.filter("[href='" + location.hash + "']")).first()
				: $($items.filter("[data-target='" + location.hash.substring(1) + "']")).length
					? $($items.filter("[data-target='" + location.hash.substring(1) +
						"']")).first()
					: $($items.filter("[data-target='" + location.hash.substring(2) +
						"']")).length &&
						location.hash.substring(0,2) == "#/"
						? $($items.filter("[data-target='" + location.hash.substring(2) +
							"']")).first()
						: $items.filter(".active").first().length
							? $items.filter(".active").first()
							: $items.first();


			if ($active.length) { tabChecker($items, $active) }

			$this.click(function(e) {
				var target = $(e.target), $this;

				if (target.closest(".item[href], .item[data-target]").length) {
					$this = target.closest(".item[href], .item[data-target]")
				}
				else { return }

				if ($this.hasClass("disabled")) { return }

				e.preventDefault();
				tabChecker($items, $this, true)
			});

			function tabChecker($items, $active, cTrigger) {
				$items.not($active).removeClass("active").each(function() {
					$($(this)[0].hash || "#" + $(this).data("target")).removeClass("active");
				});

				$active.addClass("active");

				var activeHash = $active[0].hash || "#" + $active.data("target");
				
				$(activeHash).addClass("active");

				if (cTrigger) { location.hash = "#/"+activeHash.slice(1) }
			}
		})
	}

	$(document).ready(function() { $(".tabs").tabs() })

}(jQuery));