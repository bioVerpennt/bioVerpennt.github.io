var users = [];

async function init() {
  if(users.length == 0) {
    var db = firebase.firestore().collection('UserPermissions');
    await db.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        users.push({
          email: doc.data().email,
          handled: doc.data().hasBeenHandled,
          canRead: doc.data().canRead,
          id: doc.id,
        });
      });
    }).catch(error => {
      handleError(error.message);
    });
  } else {
    document.getElementById('users').innerHTML = '';
  }
  // show unhandled users
  for(var i = 0; i < users.length; i++) {
    var user = users[i];
    console.log(user);

      var el = document.createElement('tr');
      
      if(!user.handled) {
        console.log('here');
        el.innerHTML = `
        <td>
          <p>${user.email}</p>
        </td>
        <td class="text-center">
          <span class="label label-default">Pending</span>
        </td>
        <td style="width: 20%;">
          <a onclick="accept(this.id)" id="${user.id}" class="table-link" style="cursor: pointer">
            <span class="fa-stack">
              <i style="color: rgb(5, 206, 5)" class="fa fa-check-circle fa-stack-2x"></i>
            </span>
          </a>
          <a onclick="reject(this.id)" id="${user.id}" class="table-link danger" style="cursor: pointer">
            <span class="fa-stack">
              <i class="fa fa-times-circle fa-stack-2x"></i>
            </span>
          </a>
        </td>`;
      }

      document.getElementById('users').appendChild(el);
    
  }

    // show accepted users
    for(var i = 0; i < users.length; i++) {
      var user = users[i];
      console.log(user);
  
        var el = document.createElement('tr');
        
        if(user.canRead) {
          console.log('here');
          el.innerHTML = `
          <td>
            <p>${user.email}</p>
          </td>
          <td class="text-center">
            <span class="label label-default">Accepted</span>
          </td>
          <td style="width: 20%;">
          <a onclick="accept(this.id)" id="${user.id}" class="table-link" disabled style="cursor: pointer">
            <span class="fa-stack">
              <i style="color: rgb(5, 206, 5)" class="fa fa-check-circle fa-stack-2x"></i>
            </span>
          </a>
          <a onclick="reject(this.id)" id="${user.id}" class="table-link danger" style="cursor: pointer">
            <span class="fa-stack">
              <i class="fa fa-times-circle fa-stack-2x"></i>
            </span>
          </a>
          </td>`;
        }
  
        document.getElementById('users').appendChild(el);
      
    }


        // show blocked users
        for(var i = 0; i < users.length; i++) {
          var user = users[i];
          console.log(user);
      
            var el = document.createElement('tr');
            
            if(!user.canRead && user.handled) {
              console.log('here');
              el.innerHTML = `
              <td>
                <p>${user.email}</p>
              </td>
              <td class="text-center">
                <span class="label label-default">Blocked</span>
              </td>
              <td style="width: 20%;">
              <a onclick="accept(this.id)" id="${user.id}" class="table-link" style="cursor: pointer">
              <span class="fa-stack">
                <i style="color: rgb(5, 206, 5)" class="fa fa-check-circle fa-stack-2x"></i>
              </span>
            </a>
            <a onclick="reject(this.id)" id="${user.id}" class="table-link danger" style="cursor: pointer">
              <span class="fa-stack">
                <i class="fa fa-times-circle fa-stack-2x"></i>
              </span>
            </a>
              </td>`;
            }
      
            document.getElementById('users').appendChild(el);
          
        }
}

init();


async function accept(uid) {
  await firebase.firestore().collection('UserPermissions').doc(uid).update({
    canRead: true,
    hasBeenHandled: true
  });
  users.forEach(user => {
    if(user.id == uid) {
      user.handled = true;
      user.canRead = true;
    }
  });
  init();
}

async function reject(uid) {
  await firebase.firestore().collection('UserPermissions').doc(uid).update({
    canRead: false,
    hasBeenHandled: true,
  });
  users.forEach(user => {
    if(user.id == uid) {
      user.handled = true;
      user.canRead = false;
    }
  });
  init();
}