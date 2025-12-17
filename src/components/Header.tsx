'use client';

import {
  Bell,
  User,
  PlayCircle,
  Menu,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Header({ sidebarOpen, toggleSidebar }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* Left: Sidebar Toggle & Search */}
        <div className="flex items-center flex-1 max-w-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="mr-4"
          >
            <Menu size={20} />
          </Button>
          <div className="relative w-full">
           
          Welcome back, EcoRecycle Center
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4">
         
          {/* Profile Dropdown */}
          <div className="relative">
            <Button variant="ghost" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-teal-700 font-semibold text-sm">U</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900">User</p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </Button>

            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20 hidden">
              <Link href="/profile" className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                <User size={16} />
                <span>Profile</span>
              </Link>
              <Button variant="ghost" className="w-full justify-start space-x-3">
                <LogOut size={16} />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}