import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyDj_-XAfpibzPIb6DLwkj9Hz1aGFaTiH1s",
    authDomain: "online-oscilloscope.firebaseapp.com",
    databaseURL: "https://online-oscilloscope.firebaseio.com",
    projectId: "online-oscilloscope",
    storageBucket: "online-oscilloscope.appspot.com",
    messagingSenderId: "525427984671",
    appId: "1:525427984671:web:ddb13362e939123215c82a",
    measurementId: "G-0P1VV17036"
  };
  firebase.initializeApp(config);
  export const auth = firebase.auth;
  export const db = firebase.database();