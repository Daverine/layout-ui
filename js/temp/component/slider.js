/*!
* Layout-UI slider
* Copyright 2016-2017 David A.
*/

(function($) {
    $.fn.slider = function(options) {
        this.each(function() {
          var
            defaults = {
              infinite: true, slideInterval: 1, transitionTiming: 500,
              animation: "fade",
              videoAutoPlay: true, videoMute: true,
              autoplay: true, autoplayInterval: 5000, pauseOnHover: false,
              indicator: true, controllable: true
            },
            options = $.extend(defaults, options),
            $this = $(this),
            slider = $this.find("ul.slides"),
            slides = slider.find("li.slide"),
            activeSlide = slides.filter(".active").length ? slides.filter(".active").first() : slides.first().addClass("active"),
            activeSlideIndex = slides.index(activeSlide), interval = undefined,
            allMedia = slides.find("img,video,iframe"),
            animation = {
              'none': function(current, next) {
              	switcher(current, next, 0);
              },

        	  'fade': function(current, next) {
                current.animate({opacity: 0}, {duration: options.transitionTiming});
                next.animate({opacity: 1}, {duration: options.transitionTiming/10});
                switcher(current, next, options.transitionTiming);
              },

              'scale': function(current, next) {
              	current.addClass("scale").animate({opacity: 0}, {
              	  duration: options.transitionTiming,
              	  complete: function() { $(this).removeClass("scale")}
              	});
                next.animate({opacity: 1}, {duration: options.transitionTiming/2});
                switcher(current, next, options.transitionTiming);
              },

              'slide': function(current, next) {
                var
                  currentIndex = slides.index(current),
                  nextIndex= slides.index(next),
                  slideAmt = -(nextIndex * 100) + "%"
                ;
                slider.animate({"left": slideAmt}, {duration: options.transitionTiming});
                switcher(current, next, options.transitionTiming);
              },

              'scroll': function(current, next) {
                var
                  currentIndex = slides.index(current),
                  nextIndex= slides.index(next),
                  slideAmt = -(nextIndex * 100) + "%"
                ;

                slider.animate({"top": slideAmt}, {duration: options.transitionTiming});
                switcher(current, next, options.transitionTiming);
              }
            }
          ;

          if ($(this).find("ul.slides").data("anim")) { options.animation = $(this).find("ul.slides").data("anim"); } 

          if (options.animation == "slide") {
            slides.each(function(i) {
              $(this).css({"left": (i*100) + "%"});
            })
          }

          if (options.animation == "scroll") {
            slides.each(function(i) {
              $(this).css({"top": (i*100) + "%"});
            })
          }

          function playMedia(media) {
            if (!(media && media[0])) return;
            switch(media[0].nodeName) {
              case 'VIDEO':
                if (!options.videomute) {
                  media[0].muted = false;
                }

                media[0].play();
                break;

              case 'IFRAME':
                if (!options.videomute) {
                  media[0].contentWindow.postMessage('{ "event": "command", "func": "unmute", "method":"setVolume", "value":1}', '*');
                }

                media[0].contentWindow.postMessage('{ "event": "command", "func": "playVideo", "method":"play"}', '*');
                break;
            }
          }

          function pauseMedia(media) {
            switch(media[0].nodeName) {
              case 'VIDEO':
                media[0].pause();
                break;

              case 'IFRAME':
                media[0].contentWindow.postMessage('{ "event": "command", "func": "pauseVideo", "method":"pause"}', '*');
                break;
            }
          }

          function muteMedia(media) {
            switch(media[0].nodeName) {
              case 'VIDEO':
                media[0].muted = true;
                break;

              case 'IFRAME':
                media[0].contentWindow.postMessage('{ "event": "command", "func": "mute", "method":"setVolume", "value":0}', '*');
                break;
            }
          }

          function switcher(current, next, sTime) {
          	setTimeout(function() {
              current.removeClass("active");
              next.addClass("active");
              slider.removeClass("animating");
              activeSlideIndex = next.index();
              activeSlide = slides.eq(activeSlideIndex);
            }, sTime);
          }

          function update(index) {
            activeSlideIndex = slides.index(activeSlide);

            var dir = activeSlideIndex < index ? 1 : -1;

            // Wrap around indices.
            if (index >= slides.length && options.infinite)  {
              index = index - slides.length;
            }
            else if (index >= slides.length && !options.infinite) {
              index = slides.length - 1;
            }
            else if (index < 0 && options.infinite) {
              index = slides.length + index;
            }
            else if (index < 0 && !options.infinite) {
              index = 0;
            }

            if (activeSlideIndex == index) {
              return;
            }

            var
              current = slides.eq(activeSlideIndex),
              next = slides.eq(index),
              currentMedia = current.data("media"),
              nextMedia = next.data("media")
            ;

            if (currentMedia && currentMedia.is('video,iframe')) {
              pauseMedia(currentMedia);
            }

            if (nextMedia && nextMedia.is('video,iframe')) {
              playMedia(nextMedia);
            }

            slider.addClass("animating");
            animation[options.animation](current, next, dir);

            // Update indicators
            if (options.indicator) {
              indicator.eq(activeSlideIndex).removeClass("active");
              indicator.not(indicator.eq(index)).removeClass("active");
              indicator.eq(index).addClass("active");
            }
          }

          slides.each(function(index) {
            var
              slide = $(this),
              media = slide.children("img,video,iframe").eq(0)
            ;

            slide.data({"media": media, "sizer": media});

            if (media.length) {
              var placeholder;

              switch(media[0].nodeName) {
                case "IMG":
                  var cover = $("<div class='cover-img'></div>")
                    .css({"background-image": "url('" + media.attr("src") + "')"});

                  if (media.attr("width") && media.attr("height")) {
                    placeholder = $("<canvas></canvas>")
                      .attr({width:media.attr("width"), height:media.attr("height")});
                    media.replaceWith(placeholder);
                    media = placeholder;
                    placeholder = undefined;
                  }
                  else {
                    media.css({width: "100%", height: "auto"});
                  }

                  media.css({opacity: 0}).wrap(cover);
                  media = cover;
                  cover = undefined;
                  break;

                case 'IFRAME':
                  var src = media[0].src, iframeId = "sw-" + (++playerId);

                  media.attr("src", "").on('load', function() {
                    if (index !== activeSlideIndex ||
                      (index == activeSlideIndex && !options.videoautoplay)) {
                      pauseMedia(media);
                    }

                    if (options.videomute) {
                      muteMedia(media);

                      var inv = setInterval((function(ic) {
                        return function() {
                          muteMedia(media);

                          if (++ic >= 4) clearInterval(inv);
                        }
                      })(0), 250);
                    }
                  }).data('slideshow', $this).attr('data-player-id', iframeId)
                    .attr('src', [src, (src.indexOf('?') > -1 ? '&':'?'), 'enablejsapi=1&api=1&player_id='+iframeId].join(''))
                    .addClass('absolute cover');

                  // disable pointer events
                  if(!IS_TOUCH) media.css('pointer-events', 'none');

                  placeholder = true;
                  break;

                case 'VIDEO':
                  media.addClass("absolute cover-obj");
                  placeholder = true;

                  if (options.videomute) muteMedia(media);
              }

              if (placeholder) {
                var
                  canvas = $("<canvas></canvas>")
                    .attr({"width": media[0].width, "height": media[0].height}),
                  img = $("<img style='width:100%; height:auto;'>")
                    .attr("src", canvas[0].toDataURL())
                ;

                slide.prepend(img);
                slide.data('sizer', img);
              }
            }
            else {
              slide.data('sizer', slide);
            }
          });

          // dynamically add indicators if enabled
          if (options.indicator) {
            var indicator = $("<ul class='indicator'></ul>");

            slides.each(function(index) {
              var indicatorItem = $("<li class='item'></li>");

              // Handle clicks on indicators
              indicatorItem.click(function() {
                var $parent = $this, curr_index = $parent.find($(this)).index();

                update(curr_index);
                slider.trigger("sliderPlay");
              });

              indicator.append(indicatorItem);
            });

            $this.append(indicator);
            indicator = $this.find("ul.indicator").children("li.item");
            indicator.eq(activeSlide.index()).addClass("active");
          }

          // Control functions
          slider.on("sliderPause", function() {
            clearInterval(interval);
          });

          slider.on("sliderPlay", function() {
            clearInterval(interval);
            interval = setInterval(function() {
              update(activeSlideIndex + options.slideInterval);
            }, options.autoplayInterval);
          });

          slider.on("sliderPrev", function() {
            activeSlideIndex = slides.index(activeSlide);
            update(activeSlideIndex - options.slideInterval);
            slider.trigger("sliderPlay");
          });

          slider.on("sliderNext", function() {
            activeSlideIndex = slides.index(activeSlide);
            update(activeSlideIndex + options.slideInterval);
            slider.trigger("sliderPlay");
          });

          // dynamically add controll if enabled

          if (options.controllable) {
          	var cPrev = $("<button class='c-prev'></button>").appendTo($this);
          	cPrev.click(function() { slider.trigger("sliderPrev");});

          	var cNext = $("<button class='c-next'></button>").appendTo($this);
          	cNext.click(function() { slider.trigger("sliderNext");});

            slider.on("swipeRight swipeLeft", function(e) {
              if (e.type == "swipeLeft") {
                slider.trigger("slideNext");
              }
              else {
                slider.trigger("slidePrev");
              }
            });

            slider.attr("data-anim", options.animation);
          	slider.click(function() {
              slider.toggleClass("paused");

              if (slider.hasClass("paused")) slider.trigger("sliderPause");
              else slider.trigger("sliderPlay");
            });
          }

          $(window).resize(function() {
            var heightArr = [], sliderHeight;

            allMedia.each(function() { heightArr.push($(this).outerHeight()); });
            sliderHeight = Math.max.apply(null, heightArr);
            $this.height(sliderHeight);
          });
          $(window).trigger("resize");

          // autoplay if enabled
          if (options.autoplay) slider.trigger("sliderPlay");
      });
    };

    // Initialize slider
    $(document).ready(function(){
        $(".slider").slider();
    });
}(jQuery));
