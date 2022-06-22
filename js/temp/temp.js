function update(dir, isRandom, newI) {
    var
        currI = slideNo - 1,
        prevI = currI === 0 ? slidesNo - 1 : currI - 1,
        nextI = currI === slidesNo - 1 ? 0 : currI + 1
    ;

    dir = slidesNo < 3 && ((dir === 1 && currI === slidesNo - 1) || (dir === -1 && currI === 0)) ? 0 : dir;

    if (dir === 0) {
        currSlide = slides.eq(currI);
        prevSlide = slides.eq(slidesNo > 2 || prevI < currI ? prevI : undefined);
        nextSlide = slides.eq(slidesNo > 2 || nextI > currI ? nextI : undefined);
    }
    else if (dir === 1) {
        currSlide = slides.eq(nextI);
        prevSlide = slides.eq(slidesNo > 2 || currI < nextI ? currI : undefined);
        nextSlide = slides.eq(slidesNo > 2 ? (nextI + 1 === slidesNo ? 0 : nextI + 1) : (nextI !== slidesNo - 1 ? 1 : undefined));
    }
    else if (dir === -1) {
        stopAutoplay();
        currSlide = slides.eq(prevI);
        prevSlide = slides.eq(slidesNo > 2 ? (prevI === 0 ? slidesNo - 1 : prevI - 1) : prevI === 1 ? 0 : undefined);
        nextSlide = slides.eq(slidesNo > 2 || currI > prevI ? currI : undefined);
    }
    else {
        var
            newI = newI - 1,
            prevNI = newI === 0 ? slidesNo - 1 : newI - 1,
            nextNI = newI === slidesNo - 1 ? 0 : newI + 1,
            nDir = newI === currI ? 0 : newI > currI ? 1 : -1
        ;

        if (nDir === 0) {
            currSlide = slides.eq(newI);
            prevSlide = slides.eq(slidesNo > 2 || prevI < currI ? prevI : undefined);
            nextSlide = slides.eq(slidesNo > 2 || nextI > currI ? nextI : undefined);
        }
        else if (nDir === 1) {
            stopAutoplay();
            currSlide = slides.eq(newI).removeClass("prev-slide next-slide");
            prevSlide = slides.eq(currI);
            nextSlide = slides.eq(nextNI);
        }
        else if (nDir === -1) {
            stopAutoplay();
            currSlide = slides.eq(newI).removeClass("next-slide prev-slide");
            prevSlide = slides.eq(prevNI);
            nextSlide = slides.eq(currI);
        }

        // currSlide = slides.eq(nDir === 0 ? newI);
        // prevSlide = slides.eq(nDir ? currI : slidesNo > 2 || prevNI < newI ? prevNI : undefined);
        // nextSlide = slides.eq(!nDir ? currI : slidesNo > 2 || nextNI > newI ? nextNI : undefined);
    }
    
    slides.removeClass("active prev-slide next-slide").find(".content")
        .removeAttr("style").data({x: 0, y: 0, zoom: 1})
    ;
    currSlide.addClass("active");
    if (settings.thumbnailsView && settings.gallery) {
        gToolbar.find(".caption").text(currSlide.find(".caption").text());
    }
    
    if (prevSlide.length) {
        prevSlide.addClass("prev-slide");
        prevBtn.removeClass("inactive");
    }
    else if (slidesNo > 1) { prevBtn.addClass("inactive"); }

    if (nextSlide.length) {
        nextSlide.addClass("next-slide");
        nextBtn.removeClass("inactive");
    }
    else if (slidesNo > 1) { nextBtn.addClass("inactive"); }

    slides.removeAttr("style");
    newCoords = {x: 0, y: 0};
    slideNo = currSlide.index() + 1;
    currContent = currSlide.find(".content");
    currImage = currContent.children();

    if (settings.gallery) {
        toolbar.children(".item.status").text(slideNo+"/"+slidesNo);
        if (gallery.length) {
            gallery.find(".thumbnail").removeClass("active").eq(currSlide.index()).addClass("active");
        }
    }

    if (slides < 3) {
        
    }
}