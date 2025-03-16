// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDz96rRQhTi97nPoTok98mQ559uC3_SJiE",
  authDomain: "hostal-management-6b2e6.firebaseapp.com",
  projectId: "hostal-management-6b2e6",
  storageBucket: "hostal-management-6b2e6.firebasestorage.app",
  messagingSenderId: "856523086632",
  appId: "1:856523086632:web:bef25ba77bea8d86984e1d",
  measurementId: "G-2B59F0RQHW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);