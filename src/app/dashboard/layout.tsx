"use client";

import { Metadata } from 'next'
import { ReactNode, useEffect, useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  BarChart2, 
  Search, 
  Target, 
  TrendingUp, 
  FileText, 
  Settings, 
  LogOut, 
  Bell, 
  User,
  Sun,
  Moon,
  Menu,
  X
} from "lucide-react";
import { useDarkMode } from "@/hooks/useDarkMode";
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking authentication
    // In a real app, this would check a token in localStorage or a cookie
    const checkAuth = () => {
      // For demo purposes, we'll assume the user is authenticated if they reached this page
      // In a real app, you would check for a valid token
      setIsAuthenticated(true);
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogout = () => {
    // Simulate logout
    console.log('Logging out');
    // Clear any auth tokens or state
    setIsAuthenticated(false);
    // Redirect to login
    router.push('/');
  };

  // Show loading state
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Don't render the dashboard if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`flex h-screen ${darkMode ? 'dark' : ''}`}>
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={handleLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}