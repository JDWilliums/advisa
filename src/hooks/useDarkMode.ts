"use client";

import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    // Check if window is defined (client-side only)
    if (typeof window !== "undefined") {
      // Check for system preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const savedTheme = localStorage.getItem("theme");
      
      // Use saved preference if available, otherwise use system preference
      const initialDarkMode = savedTheme 
        ? savedTheme === "dark" 
        : prefersDark;
        
      setDarkMode(initialDarkMode);
      
      // Force apply theme immediately to document
      if (initialDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      
      setMounted(true);
    }
  }, []);

  // Ensure dark mode toggle affects the document
  useEffect(() => {
    if (mounted) {
      if (darkMode) {
        // Force application of dark mode class to html element
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        // Force removal of dark mode class from html element
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  }, [darkMode, mounted]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return { darkMode, toggleDarkMode, mounted };
} 