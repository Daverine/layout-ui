/* deselecting items for multiple select dropdown */
if ($target.closest(dropdown.find(".content > .label > .close")).length) {
	var
		sItem = $target.closest(dropdown.find(".content > .label")),
		sIValue = sInput.data("value")
	;
	
	sIValue.splice(sItem.index(), 1);
	sInput.data("value", sIValue).val(sIValue);
	dropdownMenu.find("> .item, > .items > .item").not(".xhover,.disabled").eq(sItem.data("index")).removeClass("selected");
	sItem.remove();
	directItems = dropdownMenu.find("> .item, > .items > .item").not(".xhover,.disabled,.selected,.filtered");
	$(window).trigger("resize." + uniqueId);
}

/* sort dropdown if dropdown is a searchable select dropdown */
var
	directItems = dropdownMenu.find("> .item, > .items > .item").not(".xhover,.disabled"),
	asist = directItems.clone(true), sorter = [], newList = $("<div/>")
;

directItems.sort(function(a, b) { 
	return ($(b).text().toUpperCase()) < ($(a).text().toUpperCase()) ? 1 : -1; 
}).appendTo(dropdownMenu);