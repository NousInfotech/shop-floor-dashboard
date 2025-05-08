"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { Bell, Search, Settings, UserCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardHeader() {
  const pathname = usePathname();

  const getPageTitle = () => {
    const path = pathname.split("/").pop();
    if (!path) return "Dashboard";

    return path
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <header className="bg-white border-b border-zinc-200 py-4 px-6 text-zinc-900">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{getPageTitle()}</h1>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-9 w-64 bg-zinc-100 border border-zinc-300 text-zinc-900"
            />
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-zinc-900">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white text-zinc-900 border border-zinc-200">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                <DropdownMenuItem className="cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">New work order assigned</p>
                    <p className="text-sm text-zinc-500">Work order #12345 needs review</p>
                    <p className="text-xs text-zinc-400">5 minutes ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">Team assignment updated</p>
                    <p className="text-sm text-zinc-500">Team Alpha has a new member</p>
                    <p className="text-xs text-zinc-400">1 hour ago</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">Productivity report ready</p>
                    <p className="text-sm text-zinc-500">April 2025 productivity report is available</p>
                    <p className="text-xs text-zinc-400">Yesterday</p>
                  </div>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-center text-blue-600">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <Button variant="ghost" size="icon" className="text-zinc-900">
            <Settings className="h-5 w-5" />
          </Button>
          {/* User Profile Dropdown */}
          <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" className="text-zinc-900 relative">
      <img
        src="/user-avatar.png"
        alt="User"
        className="h-8 w-8 rounded-full object-cover"
      />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-56 bg-white text-zinc-900 border border-zinc-200 rounded-lg shadow-lg">
    <div className="flex items-center space-x-3 px-4 py-3">
      <img
        src="/user-avatar.png"
        alt="Admin"
        className="h-10 w-10 rounded-full object-cover"
      />
      <div>
        <p className="text-sm font-medium">Admin</p>
        <button className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1">
          <UserCircle className="h-4 w-4" />
          Kind Settings
        </button>
      </div>
    </div>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="cursor-pointer">
      Role: Super Admin
    </DropdownMenuItem>
    <DropdownMenuItem className="cursor-pointer px-4 py-2">
      <button className="w-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-1.5 rounded-md transition-colors">
        Logout
      </button>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>


        </div>
      </div>
    </header>
  );
}
