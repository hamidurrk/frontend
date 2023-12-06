import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgmpCn6VSjqMgQp3BeV9KrVZrcMTmjj64",
  authDomain: "bitsized-eb773.firebaseapp.com",
  projectId: "bitsized-eb773",
  storageBucket: "bitsized-eb773.appspot.com",
  messagingSenderId: "623213132658",
  appId: "1:623213132658:web:e35fed96816be4699d7beb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

const db = getFirestore(app);

const imageDb = getStorage(app);

export{ auth, db, imageDb };