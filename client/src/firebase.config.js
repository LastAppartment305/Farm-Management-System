// // Import the functions you need from the SDKs you need
// // import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";
// // import { getAuth } from "firebase/auth";
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-analytics.js";
// import { getAuth } from "firebase/auth";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDcx13Z8EawAWNPSWglTjC4FeocxFum02I",
//   authDomain: "farm-management-6ec00.firebaseapp.com",
//   projectId: "farm-management-6ec00",
//   storageBucket: "farm-management-6ec00.appspot.com",
//   messagingSenderId: "536098679688",
//   appId: "1:536098679688:web:7d7edf7f7e0135ea23283d",
//   measurementId: "G-BYK9B5CDH6",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const auth = getAuth(app);
// export { auth };

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcx13Z8EawAWNPSWglTjC4FeocxFum02I",
  authDomain: "farm-management-6ec00.firebaseapp.com",
  projectId: "farm-management-6ec00",
  storageBucket: "farm-management-6ec00.appspot.com",
  messagingSenderId: "536098679688",
  appId: "1:536098679688:web:7d7edf7f7e0135ea23283d",
  measurementId: "G-BYK9B5CDH6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth };
