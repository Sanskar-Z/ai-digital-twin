import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBQnHr_JWN2H8wxARimJQsFIwwFIEcb9C4",
  authDomain: "ai-powered-digital-twin.firebaseapp.com",
  projectId: "ai-powered-digital-twin",
  storageBucket: "ai-powered-digital-twin.appspot.com",
  messagingSenderId: "465152499613",
  appId: "1:465152499613:web:7f79aa314a95d38aab5974",
  measurementId: "G-6HMCYD3Y3T"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
