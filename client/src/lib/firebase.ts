import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";

// Firebase configuration using your credentials
const firebaseConfig = {
  apiKey: "AIzaSyD0wKEUZfyQHNkUN7R-zS_25zU8UoLEiAU",
  authDomain: "phantom-site-e226f.firebaseapp.com",
  projectId: "phantom-site-e226f",
  storageBucket: "phantom-site-e226f.firebasestorage.app",
  messagingSenderId: "147758091170",
  appId: "1:147758091170:web:6aac2a67d75ed92ecbc0fb",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Google sign in
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: any) => void) => {
  return onAuthStateChanged(auth, callback);
};