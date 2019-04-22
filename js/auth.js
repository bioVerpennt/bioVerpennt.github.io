async function resetPassword() {
  var email = document.getElementById('email').value;

  // set persistence
  firebase.auth().sendPasswordResetEmail(email)
    .then(function () {
      window.location.replace('./login.html');
    }).catch(function (error) {
      handleError(error.message);
    });
}

async function login() {
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;

  // set persistence
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .then(async function () {
      firebase.auth().signInWithEmailAndPassword(email, password).then(async (authObject) => {
        if (window.location.href.indexOf('admin') > -1) {
          // check if admin
          try {
            await firebase.firestore().collection('PermissionsTest').doc('TestDoc').set({
              testfield: 'abc'
            });
          } catch {
            handleError("You're not an admin");
            return;
          }
        }
        // check if sophie has granted permissions
        try {
          await firebase.firestore().collection('PermissionsTest').doc('TestDoc').get();
          window.location.replace('./index.html');
        } catch {
          handleError('Sophie muss Sie zuerst akzeptieren');
        }
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
  var email = document.getElementById('email').value;
  var password = document.getElementById('password').value;
  var passwordAgain = document.getElementById('passwordAgain').value;
  if (password != passwordAgain) {
    handleError("Passwörter stimmen nicht überein!");
    return;
  }
  firebase.auth().createUserWithEmailAndPassword(email, password).then((obj) => {
    toast("Konto erstellt! Sobald Sophie Sie akzeptiert, können Sie sich anmelden");
  }).catch(function (error) {
    handleError(error.message);
  });
}


firebase.auth().onAuthStateChanged(user => {
  if (user) {
    localStorage.setItem('myPage.expectSignIn', '1');
  } else {
    localStorage.removeItem('myPage.expectSignIn');
    var path = location.pathname;
    if (path !== "/login.html" && path !== "/admin/login.html" && path !== "/register.html" && path !== "/forgotPassword.html") {
      if (path.indexOf('/admin') > -1) {
        window.location.replace('../admin/login.html');
      } else {
        window.location.replace('/login.html');
      }
    }
    // Implement logic to trigger the login dialog here or redirect to sign-in page.
    // e.g. showDialog()
  }
});

async function init() {
  var path = location.pathname;
  if (path.indexOf('/admin') > -1) {
    // check if admin
    try {
      await firebase.firestore().collection('PermissionsTest').doc('TestDoc').set({
        testfield: 'abc'
      });
    } catch {
      if (path.indexOf('/admin/login') == -1) {
        window.location.replace('../admin/login.html');
      }
    }
  }
}

init();