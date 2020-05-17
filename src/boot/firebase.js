// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/database";


var firebaseConfig = {
  apiKey: "AIzaSyCd9g8gjo3za5VGou2hky3TMWP1juCOlAQ",
  authDomain: "vuechat-94a01.firebaseapp.com",
  databaseURL: "https://vuechat-94a01.firebaseio.com",
  projectId: "vuechat-94a01",
  storageBucket: "vuechat-94a01.appspot.com",
  messagingSenderId: "714329266896",
  appId: "1:714329266896:web:b008cfb7b05e14bf9e5cd5"
};
// Initialize Firebase
let firebaseApp = firebase.initializeApp(firebaseConfig);
let firebaseAuth = firebaseApp.auth()
let firebaseDb = firebaseApp.database()

export {
  firebaseAuth,
  firebaseDb
}
