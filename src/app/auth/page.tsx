"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthRedirect() {
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