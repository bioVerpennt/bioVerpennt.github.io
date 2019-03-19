function renderUploadButton(event) {
  var input = document.getElementById('file-upload');

  // showcase images in gallery
  var pswpElement = document.querySelectorAll('.pswp')[0];

  // build items array
  var htmlImgs = [];
  var items = [];
  for(var i = 0; i < event.target.files.length; i++) {
    var imgTmp = new Image();
    imgTmp.onload = function() {
      items.push({
        src: this.src,
        w: this.width,
        h: this.height
      });
    }
    imgTmp.src = URL.createObjectURL(event.target.files[i]);
    imgTmp.id = event.target.files[i].name;
    htmlImgs.push(imgTmp);
  }

  // add upload button and append imgs to gallery
  if (input.value == null) {
    document.getElementById('uploadImgs').style = "display: none";
    document.getElementById('gallery').style = "display: none";
  } else {
    var gallerySmall = document.getElementById('gallerySmall');
    gallerySmall.innerHTML = '';
    for(var i = 0; i < htmlImgs.length; i++) {
      var img = htmlImgs[i];
      img.classList = 'img';
      img.onclick = function(elem) {
        var options = {
          index: 0
        };

        for(var i = 0; i < event.target.files.length; i++) {
          if(event.target.files[i].name == elem.srcElement.id) {
            options.index = i;
          }
        }
        var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
      }
      gallerySmall.appendChild(img);
    }
    

    document.getElementById('uploadImgs').style = "";
    document.getElementById('gallery').style = "";
  }
}


function uploadImgs() {
  
}