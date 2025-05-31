import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";

// Firebase configuration - debug environment variables
console.log("Firebase env check:", {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ? "✅ Set" : "❌ Missing",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ? "✅ Set" : "❌ Missing",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ? "✅ Set" : "❌ Missing"
});

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: "147758091170",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

console.log("Firebase config:", firebaseConfig);

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Google sign in with better error handling
export const signInWithGoogle = async () => {
  try {
    // Add additional provider settings for better compatibility
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Google sign in successful:", result.user);
    return result.user;
  } catch (error: any) {
    console.error("Google auth error:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    
    // Provide more specific error messages
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Google sign-in was cancelled. Please try again.');
    } else if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup was blocked by your browser. Please enable popups and try again.');
    } else if (error.code === 'auth/network-request-failed') {
      throw new Error('Network error. Please check your internet connection.');
    } else {
      throw new Error('Failed to sign in with Google. Please try again.');
    }
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