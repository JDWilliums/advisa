"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  BarChart2, 
  Search, 
  Target, 
  TrendingUp, 
  FileText, 
  Sun, 
  Moon,
  ChevronRight,
  CheckCircle,
  Menu,
  X
} from "lucide-react";

const HomePage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize dark mode from localStorage
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

  // Update theme when darkMode state changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Features list for the hero section
  const features = [
    { title: "Comprehensive analytics", color: "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20" },
    { title: "AI-powered insights", color: "bg-purple-500/10 text-purple-500 dark:bg-purple-500/20" },
    { title: "Real-time reporting", color: "bg-green-500/10 text-green-500 dark:bg-green-500/20" }
  ];

  // Company logos for social proof
  const companyLogos = [
    { name: "Company 1", src: "/api/placeholder/120/40" },
    { name: "Company 2", src: "/api/placeholder/120/40" },
    { name: "Company 3", src: "/api/placeholder/120/40" },
    { name: "Company 4", src: "/api/placeholder/120/40" },
    { name: "Company 5", src: "/api/placeholder/120/40" }
  ];

  // Navigation items
  const navigation = [
    { name: "Products", href: "/products" },
    { name: "Solutions", href: "/solutions" },
    { name: "Pricing", href: "/pricing" },
    { name: "Resources", href: "/resources" },
    { name: "About", href: "/about" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0 flex items-center">
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
              
              {/* Desktop Navigation */}
              <div className="hidden md:ml-8 md:flex md:space-x-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-primary transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="flex items-center">
              {/* Dark mode toggle */}
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-accent transition-colors ml-2"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
              {/* Sign in button */}
              <Link
                href="/login"
                className="ml-4 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Sign in
              </Link>
              
              {/* CTA button */}
              <Link
                href="/register"
                className="ml-4 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 hidden sm:block"
              >
                Get started
              </Link>
              
              {/* Mobile menu button */}
              <button 
                className="ml-4 md:hidden" 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-card border-b border-border">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/register"
                className="block px-3 py-2 mt-4 text-center rounded-md text-base font-medium bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Get started
              </Link>
            </div>
          </div>
        )}
      </nav>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-8 sm:pt-16 lg:pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl">
                <span className="block text-foreground">Smart marketing decisions</span>
                <span className="block text-primary">powered by data</span>
              </h1>
              <p className="mt-6 text-xl leading-8 text-muted-foreground max-w-3xl">
                Advisa helps marketing teams make better decisions with comprehensive analytics, AI-powered insights, and real-time reporting.
              </p>
              
              {/* Feature badges */}
              <div className="mt-8 flex flex-wrap gap-3 sm:justify-center lg:justify-start">
                {features.map((feature, index) => (
                  <span 
                    key={index} 
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${feature.color}`}
                  >
                    <CheckCircle className="mr-1 h-4 w-4" />
                    {feature.title}
                  </span>
                ))}
              </div>
              
              {/* CTA */}
              <div className="mt-10 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Link
                    href="/register"
                    className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
                  >
                    Get started for free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    href="/demo"
                    className="w-full flex items-center justify-center px-6 py-3 border border-border text-base font-medium rounded-md bg-card text-foreground hover:bg-accent transition-all"
                  >
                    See it in action
                  </Link>
                </div>
              </div>
              
              {/* Social proof */}
              <div className="mt-12 border-t border-border pt-6">
                <p className="text-sm text-muted-foreground text-center lg:text-left">
                  Trusted by leading marketing teams
                </p>
                <div className="mt-4 flex flex-wrap justify-center lg:justify-start">
                  {companyLogos.map((logo, index) => (
                    <div key={index} className="flex justify-center p-2 mr-4 mb-4 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                      <Image
                        src={logo.src}
                        alt={logo.name}
                        width={120}
                        height={40}
                        className="h-8 object-contain"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Dashboard preview */}
            <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-span-6 relative">
              <div className="pl-4 -mr-40 sm:pl-6 md:-mr-16 lg:px-0 lg:m-0 lg:relative lg:h-full">
                <div className="max-w-md mx-auto sm:max-w-2xl lg:max-w-none h-full flex items-center justify-center">
                  {/* Dashboard mockup with gradient overlay */}
                  <div className="relative shadow-xl rounded-2xl overflow-hidden bg-card lg:max-w-none lg:flex lg:h-full">
                    <div className="relative w-full lg:w-auto">
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent opacity-20"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background opacity-20"></div>
                      <Image
                        src="/api/placeholder/800/600"
                        alt="Dashboard Preview"
                        width={800}
                        height={600}
                        className="lg:h-full lg:w-auto object-cover object-left-top"
                      />
                    </div>
                  </div>
                  
                  {/* Floating feature cards */}
                  <div className="absolute top-1/4 -right-4 p-4 bg-card rounded-lg shadow-lg border border-border max-w-xs hidden md:block">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 p-2 rounded-md bg-blue-500/10">
                        <Search className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium text-foreground text-sm">Brand Monitoring</h3>
                        <p className="text-xs text-muted-foreground">Track mentions and sentiment</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-1/4 left-4 p-4 bg-card rounded-lg shadow-lg border border-border max-w-xs hidden md:block">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 p-2 rounded-md bg-green-500/10">
                        <TrendingUp className="h-6 w-6 text-green-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium text-foreground text-sm">Performance Analytics</h3>
                        <p className="text-xs text-muted-foreground">Real-time campaign insights</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Everything you need to succeed in digital marketing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our all-in-one platform provides the tools and insights marketing teams need to make data-driven decisions.
          </p>
        </div>
        
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <div className="group relative bg-card hover:bg-accent/30 transition-colors p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary rounded-lg border border-border">
            <div className="mb-4 inline-flex rounded-lg p-3 bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 ring-4 ring-blue-500/10 dark:ring-blue-500/5">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-foreground">
              <Link href="/features/brand-monitor" className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true"></span>
                Brand Monitor
              </Link>
            </h3>
            <p className="mt-2 text-muted-foreground">Track brand mentions, sentiment, and share of voice across social media and the web.</p>
            <p className="mt-4 flex items-center text-sm font-medium text-primary">
              Learn more <ChevronRight className="ml-1 h-4 w-4" />
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="group relative bg-card hover:bg-accent/30 transition-colors p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary rounded-lg border border-border">
            <div className="mb-4 inline-flex rounded-lg p-3 bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 ring-4 ring-purple-500/10 dark:ring-purple-500/5">
              <BarChart2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-foreground">
              <Link href="/features/market-research" className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true"></span>
                Market Research
              </Link>
            </h3>
            <p className="mt-2 text-muted-foreground">Analyze industry trends, competition, and market gaps with AI-powered insights.</p>
            <p className="mt-4 flex items-center text-sm font-medium text-primary">
              Learn more <ChevronRight className="ml-1 h-4 w-4" />
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="group relative bg-card hover:bg-accent/30 transition-colors p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary rounded-lg border border-border">
            <div className="mb-4 inline-flex rounded-lg p-3 bg-green-500/10 text-green-500 dark:bg-green-500/20 ring-4 ring-green-500/10 dark:ring-green-500/5">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-foreground">
              <Link href="/features/seo-content" className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true"></span>
                SEO & Content
              </Link>
            </h3>
            <p className="mt-2 text-muted-foreground">Optimize your content strategy with keyword research and content gap analysis.</p>
            <p className="mt-4 flex items-center text-sm font-medium text-primary">
              Learn more <ChevronRight className="ml-1 h-4 w-4" />
            </p>
          </div>
          
          {/* Feature 4 */}
          <div className="group relative bg-card hover:bg-accent/30 transition-colors p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary rounded-lg border border-border">
            <div className="mb-4 inline-flex rounded-lg p-3 bg-orange-500/10 text-orange-500 dark:bg-orange-500/20 ring-4 ring-orange-500/10 dark:ring-orange-500/5">
              <TrendingUp className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-foreground">
              <Link href="/features/ad-performance" className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true"></span>
                Ad Performance
              </Link>
            </h3>
            <p className="mt-2 text-muted-foreground">Track and optimize campaign performance across all your digital advertising channels.</p>
            <p className="mt-4 flex items-center text-sm font-medium text-primary">
              Learn more <ChevronRight className="ml-1 h-4 w-4" />
            </p>
          </div>
          
          {/* Feature 5 */}
          <div className="group relative bg-card hover:bg-accent/30 transition-colors p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary rounded-lg border border-border">
            <div className="mb-4 inline-flex rounded-lg p-3 bg-pink-500/10 text-pink-500 dark:bg-pink-500/20 ring-4 ring-pink-500/10 dark:ring-pink-500/5">
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-foreground">
              <Link href="/features/marketing-strategy" className="focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true"></span>
                Marketing Strategy
              </Link>
            </h3>
            <p className="mt-2 text-muted-foreground">Get AI-powered recommendations for your marketing strategy based on data analysis.</p>
            <p className="mt-4 flex items-center text-sm font-medium text-primary">
              Learn more <ChevronRight className="ml-1 h-4 w-4" />
            </p>
          </div>
          
          {/* Feature 6 (CTA) */}
          <div className="group relative bg-primary/5 hover:bg-primary/10 transition-colors p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary rounded-lg border border-primary/20">
            <div className="h-full flex flex-col justify-center items-center text-center">
              <h3 className="text-lg font-medium text-foreground">Ready to get started?</h3>
              <p className="mt-2 text-muted-foreground">Experience the full power of Advisa for your marketing team.</p>
              <Link
                href="/register"
                className="mt-6 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all"
              >
                Get started for free
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Testimonial */}
      <div className="bg-accent/30 border-y border-border">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-accent/30 text-lg font-medium text-foreground">
                What our customers say
              </span>
            </div>
          </div>
          
          <div className="mt-12 mx-auto max-w-3xl">
            <div className="relative py-10 px-8 bg-card rounded-2xl border border-border shadow-md">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                </svg>
              </div>
              
              <blockquote className="relative z-10">
                <div className="text-xl font-medium leading-8 text-foreground">
                  <p>
                    &ldquo;Advisa has transformed how we approach our marketing strategy. The insights we&apos;ve gained through the platform have helped us increase our ROI by 47% in just three months.&rdquo;
                  </p>
                </div>
                <footer className="mt-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-12 w-12 rounded-full"
                        src="/api/placeholder/100/100"
                        alt="Testimonial avatar"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-base font-medium text-foreground">Sarah Johnson</div>
                      <div className="text-sm text-muted-foreground">CMO, TechCorp</div>
                    </div>
                  </div>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="bg-primary rounded-3xl shadow-lg overflow-hidden">
          <div className="pt-10 pb-12 px-6 sm:pt-16 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
            <div className="lg:self-center lg:max-w-lg">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                <span className="block">Ready to boost your marketing results?</span>
              </h2>
              <p className="mt-4 text-lg leading-6 text-primary-foreground/80">
                Get started with Advisa today and see the difference data-driven marketing can make for your business.
              </p>
              <div className="mt-8 flex space-x-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md bg-white text-primary shadow hover:bg-opacity-90 transition-all"
                >
                  Start free trial
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-primary-foreground/10 transition-all"
                >
                  Request demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <div className="relative h-8 w-24">
                {darkMode ? (
                  <Image 
                    src="/advisa-logo-no-bg.png" 
                    alt="Advisa Logo (Dark Mode)"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                ) : (
                  <Image 
                    src="/advisa.png" 
                    alt="Advisa Logo (Light Mode)"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                )}
              </div>
              <p className="text-base text-muted-foreground">
                Making smarter marketing decisions with data-driven insights.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
                    Products
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                        Brand Monitor
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                        Market Research
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                        SEO & Content
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                        Ad Performance
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
                    Resources
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                        Blog
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                        Case Studies
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                        Guides
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                        Webinars
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
                    Company
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                        About
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                        Careers
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                        Partners
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                        Contact
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">
                    Support
                  </h3>
                  <ul className="mt-4 space-y-4">
                    <li>
                      <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                        Help Center
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                        API Documentation
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                        Status
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-base text-muted-foreground hover:text-foreground">
                        Security
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8">
            <p className="text-base text-muted-foreground text-center">
              &copy; 2025 Advisa, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;