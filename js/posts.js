async function init() {
  var db = firebase.firestore().collection('BlogPosts').orderBy("date", "desc");
  db.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      var el = document.createElement('div');
      
      if(doc.data().isPublished) {
        el.innerHTML = `
        <div class="post-item" id="${doc.id}" onclick="articleAction(this.id)">
          <h4 class="post-item-title">
            ${doc.data().title}
          </h4>
          <div class="post-item-details">
            <span class="post-item-date" title="Wednesday, April 26, 2017 1:45 PM" data-placement="right">
            ${formatDate(doc.data().date)}
            </span>
            <div class="post-item-meta">
            <span class="badge badge-published"><i class="fa fa-rss"></i> Live</span>
            </div>
          </div>
        </div>`;
      } else {
        el.innerHTML = `
        <div class="post-item" id="${doc.id}" onclick="articleAction(this.id)">
          <h4 class="post-item-title">
            ${doc.data().title}
          </h4>
          <div class="post-item-details">
            <span class="post-item-date" title="Wednesday, April 26, 2017 1:45 PM" data-placement="right">
            ${formatDate(doc.data().date)}
            </span>
            <div class="post-item-meta">
            <span class="badge badge-draft"><i class="fa fa-edit"></i> Draft</span>
            </div>
          </div>
        </div>`;
      }
      
      console.log(`${doc.id} => ${doc.data()}`);
      document.getElementById('posts').appendChild(el);
    });

  }).catch(error => {
    handleError(error.message);
  });
}

function formatDate(ms) {
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var postDate = new Date(ms);
  return months[postDate.getMonth()] + ' ' + postDate.getDate() + ', ' + postDate.getFullYear();
}

function articleAction(id) {
  var buttons = document.getElementById('buttons').getElementsByTagName('button');
  for(var i = 0; i < buttons.length; i++) {
    buttons[i].disabled = false;
  }
  document.getElementById('none-selected').hidden = true;
  document.getElementById('preview').hidden = false;
  document.getElementById('preview-frame').src = './minimalArticle?id=' + id;
}

init();