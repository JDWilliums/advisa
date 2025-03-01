"use client";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SignIn() {
  const handleSignIn = async () => {
    console.log("Sign-in button clicked!");
  
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" }); // ✅ Force popups
      await signInWithPopup(auth, provider);
      console.log("User signed in successfully");
    } catch (error) {
      const err = error as Error;
      console.error("Sign-in error:", err.message);
      alert(`Error: ${err.message}`);
    }
  };
  

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={handleSignIn}
        className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 cursor-pointer"
      >
        Sign in with Google
      </button>
    </div>
  );
}
