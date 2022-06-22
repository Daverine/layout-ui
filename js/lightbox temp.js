function matchYoutubeUrl(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    var matches = url.match(p);
    if(matches){
        return matches[1];
    }
    return false;
}


function check(sender){
    var url = $('#txt').val();
    var id = matchYoutubeUrl(url);
    if(id!=false){
        alert(id);
    }else{
        alert('Incorrect URL');
    }
}

// to embed youtube video
$('#videoObject').attr('src', 'https://www.youtube.com/embed/' + match[2] + '?autoplay=1&enablejsapi=1');

// check if link is an image.
return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);


o = {
    isUrlYoutubeOne: function (e) {
      var t = document.createElement("a");
      return (t.href = e), "www.youtube.com" === t.hostname;
    },
    getTypeFromResponseContentType: function (e) {
      return e.slice(0, e.indexOf("/"));
    },
  };
function r() {
  if (4 !== n.readyState) {
    if (2 === n.readyState) {
      var e;
      switch (
        o.getTypeFromResponseContentType(
          n.getResponseHeader("content-type")
        )
      ) {
        case "image":
          e = "image";
          break;
        case "video":
          e = "video";
          break;
        default:
          e = "invalid";
      }
      (n.onreadystatechange = null), n.abort(), t(e);
    }
  } else t("invalid");
}

"#" === o.charAt(0)
? (r = document.getElementById(o.substring(1)).cloneNode(!0)).removeAttribute("id")
: (r = o)
