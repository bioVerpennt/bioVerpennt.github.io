var quill = new Quill('#editor', {
  modules: {
    imageResize: true,
    toolbar: {
      container: [
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image']
      ]
    },
  },
  placeholder: 'Compose an epic...',
  theme: 'snow',
});

async function init() {
  // get data
  var articleId = window.location.href.split('?id=')[1];
  var doc = await firebase.firestore().collection('BlogPosts').doc(articleId).get();
  document.getElementById('postTitle').value = doc.data().title;
  if(doc.data().titlePic !== null) {
    document.getElementById('titleImageButton').innerHTML = '<i>Change Title Image</i>';
  }
  quill.setContents(JSON.parse(doc.data().entry));
}

async function savePost(published) {
  // show alert saving
  Swal.showLoading();

  // upload title image
  var titlepic = document.getElementById('titleImage').files[0];
  if(titlepic !== undefined) {
    try {
      var id = + new Date();
      var storageRef = await firebase.storage().ref('images/' + firebase.auth().currentUser.uid + id.toString());
      var upload = await storageRef.put(titlepic);
      titlepic = await upload.ref.getDownloadURL();
      console.log(titlepic);
    } catch (error) {
      console.log(error);
      handleError("Konnte ein Foto nicht heraufladen")
    }
  } else {
    titlepic = null;
  }
  // upload images
  var newContent = [];
  var content = quill.getContents();
  for(var i = 0; i < content.ops.length; i++) {
    var elem = content.ops[i];
    if(elem.insert.image !== undefined && elem.insert.image.indexOf('firebasestorage') == -1) {
      var base64 = elem.insert.image;
      try {
        var id = + new Date();
        var storageRef = await firebase.storage().ref('images/' + firebase.auth().currentUser.uid + id.toString());
        var upload = await storageRef.putString(base64.replace('data:image/jpeg;base64,', ''), 'base64', {contentType:'image/jpeg'});
        var downloadURL = await upload.ref.getDownloadURL();
        elem.insert.image = downloadURL;
        console.log(downloadURL);
      } catch (error) {
        console.log(error);
        handleError("Konnte ein Foto nicht heraufladen")
      }
    }
    newContent.push(elem);
  }

  console.log(newContent);

  var previewText = quill.getText(0, 200);


  // upload article
  if(window.location.href.indexOf('?id=') > -1) {
    // update existing article
    var articleId = window.location.href.split('?id=')[1];
    if(titlepic == null) {
      await firebase.firestore().collection('BlogPosts').doc(articleId).update({
        title: document.getElementById('postTitle').value,
        entry: JSON.stringify(newContent),
        date: +new Date(),
        isPublished: published,
        length: content.length(),
        previewText: previewText
      });
    } else {
      await firebase.firestore().collection('BlogPosts').doc(articleId).update({
        title: document.getElementById('postTitle').value,
        titlePic: titlepic,
        entry: JSON.stringify(newContent),
        date: +new Date(),
        isPublished: published,
        length: content.length(),
        previewText: previewText
      });
    }
  } else {
    // upload new article
    var newPost = await firebase.firestore().collection('BlogPosts').add({
      title: document.getElementById('postTitle').value,
      titlePic: titlepic,
      entry: JSON.stringify(newContent),
      date: +new Date(),
      isPublished: published,
      length: content.length(),
      previewText: previewText
    });
    if(!published) {
      Swal.close();
      toast('Post Saved');
      window.location.replace('./editor?id=' + newPost.id);
    }
  }
  if(published) {
    Swal.close();
    toast('Post Published');
    window.location.replace('./index.html');
  } else {
    Swal.close();
    toast('Post Saved');
  }
}


function addTitleImage() {
  document.getElementById('titleImage').click();
  document.getElementById('titleImageButton').innerHTML = '<i>Change Title Image</i>';
}

init();