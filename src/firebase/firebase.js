// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8bqVhuqDMgWDulCnyzKi2LLgvQjRsYo0",
  authDomain: "learning-management-syst-77ab4.firebaseapp.com",
  projectId: "learning-management-syst-77ab4",
  storageBucket: "learning-management-syst-77ab4.appspot.com",
  messagingSenderId: "666931995842",
  appId: "1:666931995842:web:e6e1a35bba800c3671475b",
  measurementId: "G-F6XZH5VRJ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const analytics = getAnalytics(app);
export default storage;