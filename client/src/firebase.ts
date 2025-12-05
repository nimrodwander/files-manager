import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBVqwZWlRzLeZsiGnzyLH8JLDP-0JQSbeo",
  authDomain: "files-manager-ab9d8.firebaseapp.com",
  projectId: "files-manager-ab9d8",
  storageBucket: "files-manager-ab9d8.firebasestorage.app",
  messagingSenderId: "652323735514",
  appId: "1:652323735514:web:b0bcd5c355093a2c8422e3",
  measurementId: "G-WRLR161JCG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();