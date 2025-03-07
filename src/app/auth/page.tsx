"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthRedirect() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (user && !loading) {
      console.log("User is authenticated, redirecting to dashboard");
      router.push("/dashboard");
    } else if (!loading) {
      // If user is not authenticated, redirect to the root page which now contains the auth component
      console.log("User is not authenticated, redirecting to login");
      router.replace("/");
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500 dark:text-gray-400">Redirecting...</p>
    </div>
  );
} 