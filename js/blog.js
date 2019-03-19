async function test() {
  var db = firebase.firestore().collection('BlogPosts');
  db.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
    });
  }).catch(error => {
    handleError(error.message);
  });
}

test();