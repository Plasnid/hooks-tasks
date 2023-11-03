// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDq1BWlJCNf5hApep5s3GLXsOKyQtO8o4U",
  authDomain: "todo-react-plasnid.firebaseapp.com",
  projectId: "todo-react-plasnid",
  storageBucket: "todo-react-plasnid.appspot.com",
  messagingSenderId: "26937038916",
  appId: "1:26937038916:web:d4bbaab38be4917a5dc411",
  measurementId: "G-W1T94LMQKL"
};
const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)