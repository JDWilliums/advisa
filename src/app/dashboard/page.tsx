"use client";
import { useEffect, useState } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); 
      } else {
        router.push("/auth/signin");
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
      {user && <p className="mt-2">Logged in as {user.email}</p>}
      <button onClick={() => signOut(auth)} className="bg-red-500 text-white px-4 py-2 rounded mt-4">
        Sign Out
      </button>
    </div>
  );
}
