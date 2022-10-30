// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCKmZZN3T8gYRX8MQbxFGNXJ1DLErhPDS8",
    authDomain: "realtor-clone-8ec51.firebaseapp.com",
    projectId: "realtor-clone-8ec51",
    storageBucket: "realtor-clone-8ec51.appspot.com",
    messagingSenderId: "294168316262",
    appId: "1:294168316262:web:56a4687b008ca5c338a0a7",
    measurementId: "G-8ZV7K88TVZ"
};

// Initialize Firebase
initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore()