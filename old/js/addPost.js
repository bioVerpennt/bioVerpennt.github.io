var imgs = [];
var galleries = [];

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
      var width = this.width;
      var height = this.height;
      if(height/width < window.innerHeight/window.innerWidth) {
        var factor = Math.floor(window.innerWidth/width);
        width *= factor;
        height *= factor;
      } else {
        var factor = Math.floor(window.innerHeight/height);
        width *= factor;
        height *= factor;    
      }
      items.push({
        src: this.src,
        w: width,
        h: height
      });
    }
    imgTmp.src = URL.createObjectURL(event.target.files[i]);
    imgTmp.id = event.target.files[i].name;
    imgs.push(event.target.files[i]);
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


async function uploadImgs() {
  // upload imgs
  var gallery = [];
  await imgs.forEach(async img => {
    try {
      var id = + new Date();
      var storageRef = firebase.storage().ref('images/' + firebase.auth().currentUser.uid + id.toString());
      var upload = await storageRef.put(img);
      var downloadURL = await upload.ref.getDownloadURL();
      console.log(downloadURL);
    } catch (error) {
      console.log(error);
      handleError("Konnte ein Foto nicht heraufladen")
    }
    await sleep(1);
  });
  galleries.push(gallery);

  // all good message
  toast('Bilder Heraufgeladen :)');
  document.getElementById('uploadImgs').style = "display: none";

  // add button to copy gallery
  var div = document.getElementById('galleryButtons');
  var newButton = document.createElement("button");
  newButton.setAttribute("id", galleries.length - 1);
  newButton.setAttribute('class', 'bigButton');
  newButton.setAttribute('onclick', 'copygalleryid(' + galleries.length + ')');
  newButton.innerHTML = "Galerie " + galleries.length + " Kopieren";
  div.appendChild(newButton);

  // remove gallery
  document.getElementById('gallerySmall').innerHTML = '';
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function copygalleryid(id) {
  var textArea = document.createElement("textarea");
  textArea.value = "</p><br><div id='gallery" + id + "'></div><br><p>";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
    toast('Gallerie wurde in dein Clipboard Kopiert!');
  } catch (err) {
    handleError('Oops, konnte die Gallerie nicht kopieren', err);
  }

  document.body.removeChild(textArea);
}


function post() {
  firebase.firestore().collection('BlogPosts').add({
    title: document.getElementById('title').value,
    subject: document.getElementById('subject').value,
    entry: '<p>' + document.getElementById('post').value + '</p>',
    date: +new Date(),
  });

  // reset website state
  toast("Dein Beitrag wurde gepostet, yay!");
  imgs = [];
  galleries = [];
  document.getElementById('galleryButtons').innerHTML = '';
  document.getElementById('title').value = '';
  document.getElementById('subject').value = '';
  document.getElementById('post').value = '';
}