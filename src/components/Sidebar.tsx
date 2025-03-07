import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Search, 
  BarChart2, 
  FileText, 
  TrendingUp, 
  Target, 
  Settings,
  Menu,
  X
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
    <>
      {/* Mobile menu button */}
      <button 
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-md bg-white dark:bg-gray-800 shadow-md"
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside 
        className={`fixed md:relative z-30 inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-16"
        } overflow-y-auto flex flex-col`}
      >
        {/* Sidebar content */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-xl font-bold ${isSidebarOpen ? "block" : "hidden md:hidden"}`}>Advisa</h2>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-blue-600 dark:text-blue-400" : ""} />
                <span className={`ml-3 ${isSidebarOpen ? "md:block" : "md:hidden"}`}>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 md:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
} 