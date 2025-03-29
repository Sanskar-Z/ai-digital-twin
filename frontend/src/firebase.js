import { initializeApp } from 'firebase/app';
import { 
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut

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
connectAuthEmulator(auth, "http://localhost:9099"); // Corrected emulator URL

// Ensure these elements are defined or imported
const txtEmail = document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const btnLogin = document.getElementById('btnLogin');
const btnSignup = document.getElementById('btnSignup');
const btnLogout = document.getElementById('btnLogout');

const loginEmailPassword = async () => {
  const loginEmail = txtEmail.value;
  const loginPassword = txtPassword.value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    console.log(userCredential.user);
  } catch (error) {
    console.log(error);
  }


}

btnLogin.addEventListener('click', loginEmailPassword); 

const createAccount = async () => {
  const loginEmail = txtEmail.value;
  const loginPassword = txtPassword.value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, loginEmail, loginPassword);
    console.log(userCredential.user);
  } catch (error) {
    console.log(error);
  }

}

// Corrected event listener assignment for btnSignup
btnSignup.addEventListener('click', createAccount);

const monitorAuthState = async () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User is signed in:', user);
    } else {
      console.log('No user is signed in.');
    }
  });
}

monitorAuthState();

const logout = async () => {
  await signOut(auth);
}

btnLogout.addEventListener('click', logout);