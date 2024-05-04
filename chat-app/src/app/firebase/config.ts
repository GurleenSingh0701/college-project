import { getApps, initializeApp, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyDNpFD1fVTHq3FAHD5sRYTd7b0w4jU0BrY",
    authDomain: "chat-msg-project.firebaseapp.com",
    projectId: "chat-msg-project",
    storageBucket: "chat-msg-project.appspot.com",
    messagingSenderId: "122421759849",
    appId: "1:122421759849:web:dbbccccc4fc77aec9fb7f8"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
export { db, app, auth, firebaseConfig };