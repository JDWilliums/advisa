"use client";
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function SignInRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the root page which now contains the auth component
    router.replace("/");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500 dark:text-gray-400">Redirecting to login...</p>
    </div>
  );
}