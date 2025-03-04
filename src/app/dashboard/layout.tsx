"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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


export default function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Initialize dark mode from localStorage with clearer implementation
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      const initialDarkMode = savedTheme === "dark" || (savedTheme === null && prefersDark);
      
      setDarkMode(initialDarkMode);
      
      if (initialDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  // Update theme when darkMode state changes - modified for better handling
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      // Force a repaint to ensure dark mode is applied
      document.body.style.backgroundColor = '';
      setTimeout(() => {
        document.body.style.backgroundColor = '';
      }, 5);
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      // Force a repaint to ensure light mode is applied
      document.body.style.backgroundColor = '';
      setTimeout(() => {
        document.body.style.backgroundColor = '';
      }, 5);
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [pathname]);

  // Responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Brand Monitor", href: "/dashboard/brand-monitor", icon: Search },
    { name: "Market Research", href: "/dashboard/market-research", icon: BarChart2 },
    { name: "SEO & Content", href: "/dashboard/seo-content", icon: FileText },
    { name: "Ad Performance", href: "/dashboard/ad-performance", icon: TrendingUp },
    { name: "Marketing Strategy", href: "/dashboard/marketing-strategy", icon: Target },
    { name: "Saved Reports", href: "/dashboard/saved-reports", icon: FileText },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    // Use theme colors instead of hardcoded colors
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-2 bg-card text-card-foreground border-b border-border shadow-sm transition-colors duration-300">
        {/* Left section: Logo and menu toggle */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <Link href="/" className="flex items-center">
            
             
          <div className="relative h-8 w-24">
            {darkMode ? (
                <Image 
                src="/advisa-logo-no-bg.png" 
                alt="Your Logo (Dark Mode)"
                fill
                style={{ objectFit: 'contain' }}
                priority
                />
            ) : (
                <Image 
                src="/advisa.png" 
                alt="Your Logo (Light Mode)"
                fill
                style={{ objectFit: 'contain' }}
                priority
                />
            )}
            </div>
            
          </Link>
        </div>
        
        {/* Right section: Search, notifications, theme toggle, profile */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              className="hidden md:block w-60 px-3 py-1.5 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            />
          </div>
          
          <button className="p-2 rounded-full hover:bg-accent transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full"></span>
          </button>
          
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-accent transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="relative group">
            <button className="flex items-center space-x-1 focus:outline-none">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                <User size={16} />
              </div>
            </button>
            
            <div className="absolute right-0 mt-2 w-48 py-2 bg-card text-card-foreground rounded-md shadow-lg border border-border invisible group-hover:visible transition-all opacity-0 group-hover:opacity-100">
              <Link href="/dashboard/profile" className="block px-4 py-2 text-sm hover:bg-accent">
                Your Profile
              </Link>
              <Link href="/dashboard/settings" className="block px-4 py-2 text-sm hover:bg-accent">
                Settings
              </Link>
              <Link href="/dashboard/billing" className="block px-4 py-2 text-sm hover:bg-accent">
                Billing
              </Link>
              <hr className="my-1 border-border" />
              <button className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-accent flex items-center">
                <LogOut size={16} className="mr-2" /> Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden bg-background">
        {/* Sidebar Navigation */}
        <aside 
          className={`fixed md:relative z-20 inset-y-0 left-0 w-64 bg-card text-card-foreground border-r border-border transition-all duration-300 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"
          } overflow-y-auto flex flex-col`}
        >
          {/* Sidebar content */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-foreground hover:bg-accent"
                  }`}
                >
                  <item.icon size={20} className={isActive ? "text-primary" : ""} />
                  <span className={`ml-3 ${isSidebarOpen ? "md:block" : "md:hidden"}`}>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          
          {/* Logout button at bottom */}
          <div className="p-4 border-t border-border">
            <button 
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md transition-colors"
            >
              <LogOut size={20} />
              <span className={`ml-3 ${isSidebarOpen ? "md:block" : "md:hidden"}`}>Logout</span>
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 z-10 bg-black/50 md:hidden" 
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Main Content - Use theme colors instead of gray colors */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}