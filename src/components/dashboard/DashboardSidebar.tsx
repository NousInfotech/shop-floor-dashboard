"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  UsersRound,
  ClipboardList,
  Settings,
  // Activity,
  // TrendingUp,
  BarChart3,
  // FileText,
  Menu,
  ChevronLeft,
  LayoutDashboard,
  Building,
  FileSpreadsheet,
  Route,
  ShoppingCart,
  Boxes,
  Timer,
} from "lucide-react";

// Type for sidebar navigation items
type SidebarItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
  isReadOnly?: boolean;
};

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [sidebarHidden, setSidebarHidden] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
 const closeSidebar = () => setSidebarHidden(true);  // ✅ Hides the sidebar

  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  // Auto-collapse sidebar on mobile screens
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    
    window.addEventListener("resize", handleResize);
    handleResize(); // Set initial state
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarItems: SidebarItem[] = [
    { 
      title: "Dashboard", 
      href: "/dashboard", 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    // Read-only items (data from backend)
    { 
      title: "Product Sites", 
      href: "/dashboard/product-sites", 
      icon: <Building className="h-5 w-5" />,
      isReadOnly: true 
      
    },
    { 
      title: "Bill of Materials", 
      href: "/dashboard/bom", 
      icon: <FileSpreadsheet className="h-5 w-5" />,
      isReadOnly: true 
    },
    { 
      title: "Routing", 
      href: "/dashboard/routing", 
      icon: <Route className="h-5 w-5" />,
      isReadOnly: true 
    },
    { 
      title: "Pick List", 
      href: "/dashboard/pick-list", 
      icon: <ShoppingCart className="h-5 w-5" />,
      isReadOnly: true 
    },
    { 
      title: "Stock Details", 
      href: "/dashboard/stock-details", 
      icon: <Boxes className="h-5 w-5" />,
      isReadOnly: true 
    },
    // Fully functional items
    { 
      title: "Employees", 
      href: "/dashboard/employee", 
      icon: <Users className="h-5 w-5" /> 
    },
    { 
      title: "Teams", 
      href: "/dashboard/team", 
      icon: <UsersRound className="h-5 w-5" /> 
    },
    { 
      title: "Work Orders", 
      href: "/dashboard/work-orders", 
      icon: <ClipboardList className="h-5 w-5" /> 
    },
    { 
      title: "Manufacturing Sites", 
      href: "/dashboard/site", 
      icon: <Building className="h-5 w-5" /> 
    },
    { 
      title: "Shopfloor Control", 
      href: "/dashboard/control", 
      icon: <Settings className="h-5 w-5" /> 
    },
    // { 
    //   title: "Activity Tracking", 
    //   href: "/dashboard/activity", 
    //   icon: <Activity className="h-5 w-5" /> 
    // },
    // { 
    //   title: "Labor Efficiency", 
    //   href: "/dashboard/efficiency", 
    //   icon: <TrendingUp className="h-5 w-5" /> 
    // },
    { 
      title: "Productivity Metrics", 
      href: "/dashboard/productivity", 
      icon: <BarChart3 className="h-5 w-5" /> 
    },
    // { 
    //   title: "Reports", 
    //   href: "/dashboard/reports", 
    //   icon: <FileText className="h-5 w-5" /> 
    // },
     { 
      title: "Shift Management", 
      href: "/dashboard/shift-management", 
      icon: <Timer className="h-5 w-5" /> 
    },
  ];

  // Separate read-only items and functional sections
  const readOnlyItems = sidebarItems.filter(item => item.isReadOnly);
  const functionalItems = sidebarItems.filter(item => !item.isReadOnly);

  // Handle open sidebar when it's hidden
  const showSidebar = () => {
    setSidebarHidden(false);
    setCollapsed(false);
  };

  return (
    <>
      {/* Backdrop overlay with blur effect - only visible when sidebar is open on mobile */}
      {!sidebarHidden && windowWidth < 300 && (
        <div
          onClick={() => setSidebarHidden(true)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:backdrop-blur:none transition-all duration-300"
          aria-hidden="true"
        />
      )}

      {/* Open sidebar button - only visible when sidebar is hidden */}
      {sidebarHidden && (
        <button
          onClick={showSidebar}
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
      
      {/* Main content overlay with blur when sidebar is open - MOBILE ONLY */}
      {!sidebarHidden && !collapsed && windowWidth < 768 && (
        <div 
          className="fixed inset-0 z-20 pointer-events-none"
          style={{
            backgroundColor: 'transparent',
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
            // This ensures the overlay doesn't cover the sidebar area
            clipPath: 'inset(0 0 0 256px)' // 256px (w-64) for mobile expanded sidebar
          }}
        />
      )}

      <div
        className={cn(
          "relative top-0 left-0 z-30 flex flex-col h-screen bg-gradient-to-b from-slate-800 to-slate-900 text-white transition-all duration-300 border-r border-slate-700",
          sidebarHidden
            ? "w-0 overflow-hidden"                     // Completely hidden
            : collapsed
            ? "w-16"                                    // Collapsed (icon only)
            : windowWidth < 768
            ? "w-64"                                    // Responsive
            : "w-72"                                    // Full
        )}
      >
        {/* Header with logo and toggle */}
        <div className="flex items-center justify-between p-5 border-b border-slate-700">
          <div className="flex items-center">
            {/* Show logo text only when sidebar is fully open */}
            {!collapsed && !sidebarHidden && (
              <span className="ml-3 font-bold text-xl text-white tracking-tight">
                ShopFloor
              </span>
            )}
          </div>

          {/* Chevron button only when sidebar is not hidden */}
          {!sidebarHidden && (
            <button
              onClick={() => {
                // Toggle fully hiding the sidebar
                setSidebarHidden(true);
              }}
              className="p-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
              aria-label="Hide sidebar"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Main navigation */}
        <div className="flex-1 overflow-y-auto py-2 sidebar-scrollbar">
          <div className="space-y-1 px-3">
            {/* Dashboard - First item */}
            <Link
              href={functionalItems[0].href}
               onClick={closeSidebar}
              className={cn(
                "group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                pathname === functionalItems[0].href
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-300 hover:bg-slate-700/70 hover:text-white"
              )}
            >
              <div className="flex items-center justify-center">{functionalItems[0].icon}</div>
              {!collapsed && <span className="ml-3 font-medium">{functionalItems[0].title}</span>}
              {collapsed && (
                <div className="absolute left-16 z-10 w-auto p-2 m-2 min-w-max rounded-md shadow-lg 
                              text-white bg-slate-800 text-xs font-medium 
                              transition-all duration-100 scale-0 origin-left group-hover:scale-100">
                  {functionalItems[0].title}
                </div>
              )}
            </Link>
          </div>

          {/* Read-only section (if items exist) */}
          {readOnlyItems.length > 0 && (
            <>
              <div className="mt-6 mb-2 px-4">
                {!collapsed && (
                  <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Data Views
                  </p>
                )}
                <div className="space-y-1 mt-2">
                  {readOnlyItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                         onClick={closeSidebar}
                      className={cn(
                        "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                        pathname === item.href
                          ? "bg-slate-700/80 text-blue-400"
                          : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-300"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center",
                        pathname === item.href ? "text-blue-400" : "text-slate-500"
                      )}>
                        {item.icon}
                      </div>
                      {!collapsed && <span className="ml-3 font-medium">{item.title}</span>}
                      {collapsed && (
                        <div className="absolute left-16 z-10 w-auto p-2 m-2 min-w-max rounded-md shadow-lg 
                                      text-white bg-slate-800 text-xs font-medium 
                                      transition-all duration-100 scale-0 origin-left group-hover:scale-100">
                          {item.title}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="mx-3 my-3 border-t border-slate-700/50"></div>
            </>
          )}

          {/* Functional sections */}
          <div className="px-4 pb-2">
            {!collapsed && (
              <p className="px-2 mt-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Management
              </p>
            )}
            <div className="space-y-1">
              {functionalItems.slice(1).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                     onClick={closeSidebar}
                  className={cn(
                    "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                    pathname === item.href
                      ? "bg-blue-600/90 text-white shadow-md"
                      : "text-slate-300 hover:bg-slate-700/70 hover:text-white"
                  )}
                >
                  <div className="flex items-center justify-center">{item.icon}</div>
                  {!collapsed && <span className="ml-3 font-medium">{item.title}</span>}
                  {collapsed && (
                    <div className="absolute left-16 z-10 w-auto p-2 m-2 min-w-max rounded-md shadow-lg 
                                  text-white bg-slate-800 text-xs font-medium 
                                  transition-all duration-100 scale-0 origin-left group-hover:scale-100">
                      {item.title}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}