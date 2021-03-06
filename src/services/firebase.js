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
firebase.initializeApp(config)
//export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app()
export const auth = firebase.auth;
export const db = firebase.database();
const storage = firebase.storage();


// export default class fb_s{
//   constructor(name) {
//     this.name = name;
//   }
//   function getMetaData(key){}
//   function pushMetaData(data){}
 export function pushWaveformData(data,id){
  var WavformRef = storage.ref(`CustomerID/Wavform/${id}`);

  WavformRef.putString(data).then((snapshot) => {
    console.log('Uploaded a raw string!');
  });
}
  
// }
// }

// class Singleton {
//   constructor() {
//     firebase.initializeApp(config) 
//    // ...
//   }

//   method1() {
//     // ...
//   }

//   method2() {
//     // ...
//   }
// }

// const fb = new Singleton();

// Object.freeze(singletonInstance)