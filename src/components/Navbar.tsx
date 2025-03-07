import Link from 'next/link';
import Image from 'next/image';
import { Bell, Sun, Moon, User, LogOut } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onLogout: () => void;
}

export default function Navbar({ darkMode, toggleDarkMode, onLogout }: NavbarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Left section: Logo */}
      <div className="flex items-center">
        <Link href="/dashboard" className="flex items-center">
          <div className="relative h-8 w-24">
            {darkMode ? (
              <Image 
                src="/advisa-logo-no-bg.png" 
                alt="Advisa Logo (Dark Mode)"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            ) : (
              <Image 
                src="/advisa.png" 
                alt="Advisa Logo (Light Mode)"
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
            className="hidden md:block w-60 px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          />
        </div>
        
        <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
          <Bell size={20} className="text-gray-700 dark:text-gray-300" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun size={20} className="text-gray-700 dark:text-gray-300" />
          ) : (
            <Moon size={20} className="text-gray-700 dark:text-gray-300" />
          )}
        </button>
        
        <div className="relative group">
          <button className="flex items-center space-x-1 focus:outline-none">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
              <User size={16} />
            </div>
          </button>
          
          <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 invisible group-hover:visible transition-all opacity-0 group-hover:opacity-100">
            <Link href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              Your Profile
            </Link>
            <Link href="/dashboard/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              Settings
            </Link>
            <Link href="/dashboard/billing" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
              Billing
            </Link>
            <hr className="my-1 border-gray-200 dark:border-gray-700" />
            <button 
              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center" 
              onClick={onLogout}
            >
              <LogOut size={16} className="mr-2" /> Sign out
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 