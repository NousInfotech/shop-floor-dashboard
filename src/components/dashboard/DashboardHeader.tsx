"use client";
import React from "react";
// import { usePathname } from "next/navigation";
import { Bell, LogOut, User, Settings } from "lucide-react";
// import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function DashboardHeader() {
  return (
    <header className="bg-white border-b border-zinc-200 py-4 px-6 text-zinc-900">
      <div className="flex justify-end items-center">
        {/* Right-aligned items container */}
        <div className="flex items-center space-x-4">
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

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 text-zinc-900 hover:bg-zinc-100">
                <div className="h-8 w-8 bg-slate-800 rounded-full flex items-center justify-center text-white">
                  JD
                </div>
                <span className="font-medium">John Doe</span>
                <span className="text-zinc-400">▼</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white text-zinc-900 border border-zinc-200 rounded-lg shadow-lg p-1">
              {/* User Info Section */}
              <div className="px-4 py-3 border-b border-zinc-100">
                <p className="font-medium text-base mb-1">John Doe</p>
                <p className="text-sm text-zinc-500">john.doe@example.com</p>
              </div>
              
              {/* Menu Items */}
              <DropdownMenuItem className="cursor-pointer flex items-center py-2 px-4 hover:bg-zinc-50">
                <User className="h-4 w-4 mr-3 text-zinc-600" />
                <span>Profile</span>
              </DropdownMenuItem>
              <Link href="/dashboard/settings">
              <DropdownMenuItem className="cursor-pointer flex items-center py-2 px-4 hover:bg-zinc-50">
                <Settings className="h-4 w-4 mr-3 text-zinc-600" />
                <span>Settings</span>
              </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator className="my-1" />
              
              <DropdownMenuItem className="cursor-pointer flex items-center py-2 px-4 hover:bg-zinc-50 text-red-600">
                <LogOut className="h-4 w-4 mr-3" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}