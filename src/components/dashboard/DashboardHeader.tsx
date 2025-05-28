"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Settings } from "lucide-react";
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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    // Add logout logic here (e.g., clearing tokens)
    router.push("/sign-in");
  };

  return (
    <>
      <header className="bg-white border-b border-zinc-200 py-4 px-6 text-zinc-900">
        <div className="flex justify-end items-center">
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
                <div className="px-4 py-3 border-b border-zinc-100">
                  <p className="font-medium text-base mb-1">John Doe</p>
                  <p className="text-sm text-zinc-500">john.doe@example.com</p>
                </div>

                <Link href="/dashboard/settings">
                  <DropdownMenuItem className="cursor-pointer flex items-center py-2 px-4 hover:bg-zinc-50">
                    <Settings className="h-4 w-4 mr-3 text-zinc-600" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  onClick={() => setShowLogoutConfirm(true)}
                  className="cursor-pointer flex items-center py-2 px-4 hover:bg-zinc-50 text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="mb-6 text-sm text-zinc-600">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm rounded-md border border-zinc-300 text-zinc-700 hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
