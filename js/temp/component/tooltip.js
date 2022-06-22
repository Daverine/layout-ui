(function ($) {

	$.fn.extend({
		tooltip: function (options) {
			var defaults = {
				pluginName: "tooltips",
				inDuration: 270,
				outDuration: 200,
				spacing: 10,
			};

			// Remove tooltip from the activator
			if (options === "remove") {
				this.each(function () {
					$('#' + $(this).data("uniqueId")).remove();
					$(this).off("mouseenter."+options.pluginName + " mouseleave."+options.pluginName);
				});
				return;
			}

			this.each(function () {
				var $this = $(this);
				options = $.extend(defaults, options);

				$this.data("uniqueId", getUniqueId(options.pluginName));

				$this.on("mouseenter."+options.pluginName, function() {
					$this.showTooltip(options);
				});
				
				$this.on("mouseleave."+options.pluginName, function() {
					$this.hideTooltip(options);
				});
			});
		},

		showTooltip: function (options) {    
			var $this = $(this), tooltip = $("<div class='tooltip'></div>"), uniqueId;

			uniqueId = $this.data("uniqueId");

			if ($this.is("[data-content]") && $this.is("[data-title]")) {
				tooltip.append(
					"<div class='heading'>"+$this.data("title")+
					"</div><div class='content'>"+$this.data("content")+"</div>"
				);
			}
			else if ($this.is("[data-content]")) {
				tooltip.text($this.data("content"));
			}
			else if ($this.is("[data-html]")) {
				tooltip.append($this.data("html"));
			}
			else if ($this.is("[data-tooltip-id]")) {
				tooltip.append($("#"+$this.data("tooltip-id")).closest(".tooltip-html").html());
			}

			tooltip.appendTo($('body')).attr("id", uniqueId).css("opacity", 0);
			options.tooltip = tooltip;

			var
				$thisFactor = {
					h: $this.outerHeight(),
					w: $this.outerWidth(),
					y: $this.offset().top,
					x: $this.offset().left
				},
				tooltipFactor = {
					h: tooltip.outerHeight(),
					w: tooltip.outerWidth(),
					p: $this.attr('data-position')
				}, cord = {}
			;

			if (tooltipFactor.p === "top") {
				cord.y = $thisFactor.y - tooltipFactor.h - options.spacing;
				cord.x = $thisFactor.x + $thisFactor.w/2 - tooltipFactor.w/2;
				if (cord.x < 0) {cord.x = $thisFactor.x};
			}
			else if (tooltipFactor.p === "left") {
				cord.y = $thisFactor.y + $thisFactor.h/2 - tooltipFactor.h/2;
				cord.x = $thisFactor.x - tooltipFactor.w - options.spacing;
				if (cord.y < 0) {cord.y = $thisFactor.y};
			}
			else if (tooltipFactor.p === "right") {
				cord.y = $thisFactor.y + $thisFactor.h/2 - tooltipFactor.h/2;
				cord.x = $thisFactor.x + $thisFactor.w + options.spacing;
				if (cord.y < 0) {cord.y = $thisFactor.y};
			}
			else if (tooltipFactor.p === "bottom") {
				cord.y = $thisFactor.y + $thisFactor.h + options.spacing;
				cord.x = $thisFactor.x + $thisFactor.w/2 - tooltipFactor.w/2;
				if (cord.x < 0) {cord.x = $thisFactor.x};
			}
			else {
				var tcord={}, lcord={}, rcord={}, bcord={};
				cord.st = $thisFactor.y - window.pageYOffset;
				cord.sb = window.innerHeight - cord.st - $thisFactor.h;
				tcord.y = $thisFactor.y - tooltipFactor.h - options.spacing;
				bcord.y = $thisFactor.y + $thisFactor.h + options.spacing;
				cord.x = $thisFactor.x + $thisFactor.w/2 - tooltipFactor.w/2;
				if (Math.max(cord.st, cord.sb) === cord.st) {
					cord.y = tcord.y; tooltipFactor.p = "top";
				}
				else {cord.y = bcord.y; tooltipFactor.p = "bottom"};
				if (cord.x < 0) {cord.x = $thisFactor.x};
			}

			tooltip.attr("data-position", tooltipFactor.p).css({
				top: cord.y, left: cord.x
			}).animate({opacity: 1}, options.inDuration);
		},

		hideTooltip: function (options) {
			var $this = $(this), tooltip = options.tooltip;

			tooltip.fadeOut(options.outDuration, function() {$(this).remove();});
		}
	});

	$(document).ready(function () {
		$(".tooltipper").tooltip();
	});
}( jQuery ));