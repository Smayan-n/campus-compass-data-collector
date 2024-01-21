// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyC4_7h7BSUXQfMBKMbkJLJfNts9sFP7Bac",
	authDomain: "uw-campus-compass.firebaseapp.com",
	projectId: "uw-campus-compass",
	storageBucket: "uw-campus-compass.appspot.com",
	messagingSenderId: "3412284517",
	appId: "1:3412284517:web:244dc9689501df7777228c",
	measurementId: "G-RFQYL006CJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestoreDB = getFirestore(app);
const firebaseStorage = getStorage();
export { firebaseStorage, firestoreDB };
