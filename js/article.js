async function init() {
  // get data
  var articleId = window.location.href.split('?id=')[1];
  var doc = await firebase.firestore().collection('BlogPosts').doc(articleId).get();
  console.log(doc.data());
  document.getElementById('postMeta').innerHTML = formatDate(doc.data().date) + ' · ' + Math.ceil(doc.data().length/1000) + ' min read';
  document.getElementById('postTitle').innerHTML = doc.data().title;
  if(window.location.href.indexOf('minimal') == -1) {
    document.getElementById('headerImage').style = 'background-image: url(' + doc.data().titlePic + ');';
  }

  // render article
  var quill = new Quill('#editor', {
    modules: {
      toolbar: false,
    },
    theme: 'snow',
  });
  quill.setContents(JSON.parse(doc.data().entry));
  quill.enable(false);
}


function formatDate(ms) {
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var postDate = new Date(ms);
  return months[postDate.getMonth()] + ' ' + postDate.getDate() + ', ' + postDate.getFullYear();
}


init();