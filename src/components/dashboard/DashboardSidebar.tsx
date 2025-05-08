"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Users,
  UsersRound,
  ClipboardList,
  PanelTop,
  Activity,
  TrendingUp,
  LineChart,
  FileBarChart,
  Menu,
  ChevronLeft,
  LayoutDashboard
} from "lucide-react";

type SidebarItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarItems: SidebarItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { title: "Employee", href: "/dashboard/employee", icon: <Users className="h-5 w-5" /> },
    { title: "Team", href: "/dashboard/team", icon: <UsersRound className="h-5 w-5" /> },
    { title: "Work Orders", href: "/dashboard/work-orders", icon: <ClipboardList className="h-5 w-5" /> },
    { title: "Shopfloor Control", href: "/dashboard/control", icon: <PanelTop className="h-5 w-5" /> },
    { title: "Employee Activity", href: "/dashboard/activity", icon: <Activity className="h-5 w-5" /> },
    { title: "Labor Efficiency", href: "/dashboard/efficiency", icon: <TrendingUp className="h-5 w-5" /> },
    { title: "Productivity", href: "/dashboard/productivity", icon: <LineChart className="h-5 w-5" /> },
    { title: "Reports", href: "/dashboard/reports", icon: <FileBarChart className="h-5 w-5" /> },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-white text-zinc-900 transition-all duration-300 border-r border-zinc-200",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-zinc-200">
        <div className="flex items-center">
          <div className="flex-shrink-0 flex items-center justify-center bg-blue-600 text-white h-8 w-8 rounded">
            <span className="font-bold text-lg">SF</span>
          </div>
          {!collapsed && (
            <span className="ml-3 font-bold text-xl text-zinc-900">ShopFloor</span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded-md hover:bg-zinc-100"
        >
          {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center px-2 py-3 text-base font-medium rounded-md transition-colors",
                pathname === item.href
                  ? "bg-blue-600 text-white"
                  : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900"
              )}
            >
              <div className="flex items-center justify-center">{item.icon}</div>
              {!collapsed && <span className="ml-3 font-semibold">{item.title}</span>}
              {collapsed && (
                <div className="absolute left-16 z-10 w-auto p-2 m-2 min-w-max rounded-md shadow-md 
                               text-white bg-black text-xs font-bold 
                               transition-all duration-100 scale-0 origin-left group-hover:scale-100">
                  {item.title}
                </div>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* <div className="p-4 border-t border-zinc-200">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-zinc-300 flex items-center justify-center">
            <span className="text-sm font-medium text-zinc-800">JD</span>
          </div>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-zinc-900">John Doe</p>
              <p className="text-xs text-zinc-500">Admin</p>
            </div>
          )}
        </div>
      </div> */}
    </div>
  );
}
