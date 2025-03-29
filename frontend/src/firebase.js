import { initializeApp } from 'firebase/app';
import { 
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword 
} from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyBQnHr_JWN2H8wxARimJQsFIwwFIEcb9C4",
  authDomain: "ai-powered-digital-twin.firebaseapp.com",
  projectId: "ai-powered-digital-twin",
  storageBucket: "ai-powered-digital-twin.firebasestorage.app",
  messagingSenderId: "465152499613",
  appId: "1:465152499613:web:7f79aa314a95d38aab5974",
  measurementId: "G-6HMCYD3Y3T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(firebaseConfig);
connectAuthEmulator(auth, "http://localhost:5173/login");

const loginEmailPassword = async () => {
  const loginEmail = txtEmail.value;
  const loginPassword = txtPassword.value;

  try {
    
  } catch (error) {
    con
  }

  const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
  console.log(userCredential.user);

}

btnLogin.addEventListener('click', loginEmailPassword); 

export default app;
