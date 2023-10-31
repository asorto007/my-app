// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4V6GcY2e7AFJAcE9hc-gWk77278W-mhk",
  authDomain: "gitwell-d5d6c.firebaseapp.com",
  projectId: "gitwell-d5d6c",
  storageBucket: "gitwell-d5d6c.appspot.com",
  messagingSenderId: "616963111418",
  appId: "1:616963111418:web:a6c64167d0998dd276cc43",
  measurementId: "G-64WGQM8TS6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
