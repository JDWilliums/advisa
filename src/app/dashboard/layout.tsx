"use client";

import { Metadata } from 'next'
import { ReactNode, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { user, loading, logout, debugAuthState } = useAuth();

  // Log auth state for debugging
  useEffect(() => {
    console.log("Dashboard layout mounted, auth state:", {
      isAuthenticated: !!user,
      loading
    });
    
    // Debug auth state on mount
    debugAuthState();
  }, [user, loading, debugAuthState]);

  // Show loading state
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Don't render the dashboard if not authenticated
  // (The redirect will be handled by AuthContext)
  if (!user) {
    return null;
  }

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Navbar at the top */}
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} onLogout={logout} />
      
      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onLogout={logout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}