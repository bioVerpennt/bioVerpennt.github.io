async function init() {
  if(window.location.href.indexOf('?loadAll=true') == -1) {
    var db = firebase.firestore().collection('BlogPosts').where("isPublished", "==", true).limit(5);
  } else {
    var db = firebase.firestore().collection('BlogPosts').where("isPublished", "==", true);
  }
  var posts = [];
  db.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      posts.push({
        title: doc.data().title,
        id: doc.id,
        previewText: doc.data().previewText,
        date: doc.data().date,
      });
    });
    posts.sort( compare );
    posts.forEach((doc) => {

      var el = document.createElement('div');
      
      
        console.log('here');
        el.innerHTML = `
        <div class="loop-item ">
      <div class="loop-item-body body-wrap">
        
        <h2 class="loop-title">
          <a href="./article?id=${doc.id}">${doc.title}</a>
        </h2>

        
        <div class="loop-excerpt">
          <p>${doc.previewText}</p>
        </div>

        
        

        
        <div class="loop-meta">
                 
            Von Sophie


          
          am
          ${formatDate(doc.date)}
        </div>
      </div>
    </div>`;
      

      document.getElementById('posts').appendChild(el);
    });
  }).catch(error => {
    handleError(error.message);
  });
}

function formatDate(ms) {
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var postDate = new Date(ms);
  return postDate.getDate() + '. ' + months[postDate.getMonth()] + ' ' + postDate.getFullYear();
}

function compare( a, b ) {
  if ( a.date > b.date ){
    return -1;
  }
  if ( a.date < b.date ){
    return 1;
  }
  return 0;
}

init();