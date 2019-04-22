async function login() {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  // set persistence
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(function () {
      firebase.auth().signInWithEmailAndPassword(email, password).then((authObject) => {
        window.location.replace('blog.html');
      }).catch(function (error) {
        handleError(error.message);
      });
    })
    .catch(function (error) {
      handleError(error.message);
    });
}

async function logout() {
  firebase.auth().signOut().catch(function (error) {
    // An error happened.
  });
}

async function register() {
  var name = document.getElementById('name').value;
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var passwordAgain = document.getElementById('passwordAgain').value;
  if(password != passwordAgain) {
    handleError("Passwörter stimmen nicht überein!");
    return;
  }  
  firebase.auth().createUserWithEmailAndPassword(email, password).then((obj) => {
    
    var db = firebase.firestore().collection('UserData');
    db.doc(obj.user.uid).set({
      name: name
    }).catch(error => {
      handleError(error.message);
    });

    alert("Konto erstellt! Sobald Sophie Sie akzeptiert, können Sie sich anmelden");
  }).catch(function (error) {
    handleError(error.message);
  });
}


firebase.auth().onAuthStateChanged(user => {
  if (user) {
    localStorage.setItem('myPage.expectSignIn', '1');
    // console.log(user);
    if (location.pathname == "/" || location.pathname == "/index.html") {
      window.location.replace('blog.html');
    }
  } else {
    localStorage.removeItem('myPage.expectSignIn');
    var path = location.pathname;
    if (path !== "/" && path !== "/register.html") {
      window.location.replace('/');
    }
    // Implement logic to trigger the login dialog here or redirect to sign-in page.
    // e.g. showDialog()
  }
})