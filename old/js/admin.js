async function test() {
  var db = firebase.firestore().collection('UserPermissions');
  db.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(doc.data().canEdit);
    });
  }).catch(error => {
    handleError(error.message);
  });
}

test();