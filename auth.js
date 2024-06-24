const firebaseConfig = {
    apiKey: "AIzaSyCCoxzcsGEdO3PWSJpXmHxmTxQvEv9pXxo",
    authDomain: "practicejournal-7642a.firebaseapp.com",
    databaseURL: "https://practicejournal-7642a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "practicejournal-7642a",
    storageBucket: "practicejournal-7642a.appspot.com",
    messagingSenderId: "569532974732",
    appId: "1:569532974732:web:e6eb52f981161e731bdda9"
  };
  
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const database = firebase.database();
  
  auth.onAuthStateChanged(user => {
    if (user) {
      if (document.getElementById('login-div')) {
        document.getElementById('login-div').style.display = 'none';
      }
      if (document.getElementById('charts-container')) {
        document.getElementById('charts-container').style.display = 'flex';
        fetchDataAndVisualize(); // Only call this on the stats page
      }
      if (document.getElementById('form-div')) {
        document.getElementById('form-div').style.display = 'flex';
      }
    } else {
      if (document.getElementById('login-div')) {
        document.getElementById('login-div').style.display = 'block';
      }
      if (document.getElementById('charts-container')) {
        document.getElementById('charts-container').style.display = 'none';
      }
      if (document.getElementById('form-div')) {
        document.getElementById('form-div').style.display = 'none';
      }
    }
  });
  
  document.getElementById('google-login')?.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then(result => {
      if (document.getElementById('login-div')) {
        document.getElementById('login-div').style.display = 'none';
      }
      if (document.getElementById('charts-container')) {
        document.getElementById('charts-container').style.display = 'flex';
      }
      if (document.getElementById('form-div')) {
        document.getElementById('form-div').style.display = 'flex';
      }
    }).catch(error => {
      console.log(error);
    });
  });
  
  document.getElementById('logout')?.addEventListener('click', () => {
    auth.signOut().then(() => {
      if (document.getElementById('login-div')) {
        document.getElementById('login-div').style.display = 'block';
      }
      if (document.getElementById('charts-container')) {
        document.getElementById('charts-container').style.display = 'none';
      }
      if (document.getElementById('form-div')) {
        document.getElementById('form-div').style.display = 'none';
      }
    }).catch(error => {
      console.log(error);
    });
  });
  